using FluentResults;
using iText.Barcodes;
using iText.Html2pdf;
using iText.Html2pdf.Resolver.Font;
using iText.IO.Font;
using iText.IO.Font.Constants;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Pdf.Extgstate;
using iText.Kernel.Pdf.Xobject;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.StyledXmlParser.Css.Media;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public interface IWatermarkService
    {
        /// <summary>
        /// Adds a text watermark to a PDF document
        /// </summary>
        /// <param name="inputPdfBytes">The original PDF document as byte array</param>
        /// <param name="watermarkText">Text to use as watermark</param>
        /// <param name="opacity">Opacity of the watermark (0.0-1.0)</param>
        /// <returns>The watermarked PDF as byte array</returns>
        Task<Result<byte[]>> AddWatermarkToPdfAsync(byte[] inputPdfBytes, string watermarkText, float opacity = 0.3f);

        /// <summary>
        /// Adds a text watermark to a PDF document
        /// </summary>
        /// <param name="inputStream">The original PDF document stream</param>
        /// <param name="outputStream">The stream to write the watermarked PDF to</param>
        /// <param name="watermarkText">Text to use as watermark</param>
        /// <param name="opacity">Opacity of the watermark (0.0-1.0)</param>
        /// <returns>Success or failure result</returns>
        Task<Result> AddWatermarkToPdfAsync(Stream inputStream, Stream outputStream, string watermarkText, float opacity = 0.3f);

        /// <summary>
        /// Adds an HTML stamp to a PDF document at the bottom right corner
        /// </summary>
        /// <param name="inputPdfBytes">The original PDF document as byte array</param>
        /// <param name="htmlContent">HTML content for the stamp</param>
        /// <returns>The PDF with stamp as byte array</returns>
        Task<Result<byte[]>> AddHtmlStampToPdfAsync(byte[] inputPdfBytes, string htmlContent);

        /// <summary>
        /// Adds a signature stamp to a PDF document at the bottom right corner
        /// </summary>
        /// <param name="inputPdfBytes">The original PDF document as byte array</param>
        /// <param name="signatureInfo">Signature information (can be multiple lines)</param>
        /// <returns>The PDF with signature stamp as byte array</returns>
        Task<Result<byte[]>> AddSignatureStampToPdfAsync(byte[] inputPdfBytes, string signatureInfo);
        Task<Result<byte[]>> AddSignatureStampDirectlyToPdfAsync(byte[] inputPdfBytes, List<string> signatureInfo, string docGuid, int docId);
        public string GenerateSecureLink(string inn, string guid, bool temporal = false);
        public DocumentData DecryptSecureLink(string token);
    }

    public class DocumentData
    {
        public string Inn { get; set; }
        public string Date { get; set; }
        public string Guid { get; set; }
    }

    public class WatermarkService : IWatermarkService
    {
        private readonly ILogger<WatermarkService> _logger;
        private readonly string _apiCabinetUrl;
        private string _secretKey;

        public WatermarkService(ILogger<WatermarkService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _apiCabinetUrl = configuration.GetValue<string>("ExternalApi:CabinetUrl") ?? "http://localhost:3001";
            _secretKey = configuration.GetValue<string>("Jwt:Key");

        }




        // Генерация зашифрованной ссылки
        public string GenerateSecureLink(string inn, string guid, bool t = false)
        {
            // Формируем компактную строку данных
            var expiry = t ? DateTimeOffset.UtcNow.AddDays(1).ToUnixTimeSeconds()
                           : DateTimeOffset.UtcNow.AddYears(100).ToUnixTimeSeconds();
            var data = $"{inn}|{guid}|{expiry}";

            // Шифруем с помощью AES
            using (var aes = Aes.Create())
            {
                // Используем первые 32 байта ключа для AES-256
                // Ваш ключ: !63vKd91Rn7Up@qk0e0%T1Wt1S9!O@^E (ровно 32 символа - идеально!)
                var key = Encoding.UTF8.GetBytes(_secretKey);

                // Если ключ не 32 байта, дополняем или обрезаем
                if (key.Length < 32)
                {
                    Array.Resize(ref key, 32);
                }
                else if (key.Length > 32)
                {
                    key = key.Take(32).ToArray();
                }

                aes.Key = key;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;
                aes.GenerateIV();

                var encryptor = aes.CreateEncryptor();
                var dataBytes = Encoding.UTF8.GetBytes(data);
                var encrypted = encryptor.TransformFinalBlock(dataBytes, 0, dataBytes.Length);

                // Объединяем IV + зашифрованные данные
                var result = new byte[aes.IV.Length + encrypted.Length];
                Array.Copy(aes.IV, 0, result, 0, aes.IV.Length);
                Array.Copy(encrypted, 0, result, aes.IV.Length, encrypted.Length);

                // Конвертируем в Base64Url (короче обычного Base64)
                var res = Base64UrlEncode(result);
                return res;
            }
        }

        public (string inn, string guid, DateTime expiry, bool isValid) DecryptSecureLink2(string encryptedLink)
        {
            try
            {
                var data = Base64UrlDecode(encryptedLink);

                using (var aes = Aes.Create())
                {
                    var key = Encoding.UTF8.GetBytes(_secretKey);

                    if (key.Length < 32)
                    {
                        Array.Resize(ref key, 32);
                    }
                    else if (key.Length > 32)
                    {
                        key = key.Take(32).ToArray();
                    }

                    aes.Key = key;
                    aes.Mode = CipherMode.CBC;
                    aes.Padding = PaddingMode.PKCS7;

                    // Извлекаем IV (первые 16 байт)
                    var iv = new byte[16];
                    Array.Copy(data, 0, iv, 0, 16);
                    aes.IV = iv;

                    // Расшифровываем остальное
                    var decryptor = aes.CreateDecryptor();
                    var encrypted = new byte[data.Length - 16];
                    Array.Copy(data, 16, encrypted, 0, encrypted.Length);

                    var decrypted = decryptor.TransformFinalBlock(encrypted, 0, encrypted.Length);
                    var result = Encoding.UTF8.GetString(decrypted);

                    var parts = result.Split('|');
                    if (parts.Length != 3)
                    {
                        return ("", "", DateTime.MinValue, false);
                    }

                    var expiryTimestamp = long.Parse(parts[2]);
                    var expiryDate = DateTimeOffset.FromUnixTimeSeconds(expiryTimestamp).UtcDateTime;

                    // Проверяем срок действия
                    bool isValid = DateTime.UtcNow <= expiryDate;

                    return (parts[0], parts[1], expiryDate, isValid);
                }
            }
            catch
            {
                return ("", "", DateTime.MinValue, false);
            }
        }

        private string Base64UrlEncode(byte[] input)
        {
            var output = Convert.ToBase64String(input);
            output = output.Replace('+', '-').Replace('/', '_').Replace("=", "");
            return output;
        }

        private byte[] Base64UrlDecode(string input)
        {
            var output = input.Replace('-', '+').Replace('_', '/');
            switch (output.Length % 4)
            {
                case 2: output += "=="; break;
                case 3: output += "="; break;
            }
            return Convert.FromBase64String(output);
        }

        // Дешифрование и получение данных
        // Проверка времени действия токена без полной валидации
        public bool IsTokenExpired(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);

                return jwtToken.ValidTo < DateTime.UtcNow;
            }
            catch
            {
                return true; // Если не можем прочитать токен - считаем его недействительным
            }
        }

        // Дешифрование и получение данных с проверкой времени действия
        public DocumentData DecryptSecureLink(string token)
        {
            try
            {
                var data = DecryptSecureLink2(token);

                //var tokenHandler = new JwtSecurityTokenHandler();
                //var key = Encoding.ASCII.GetBytes(_secretKey);

                //// Проверяем токен с валидацией времени жизни
                //tokenHandler.ValidateToken(token, new TokenValidationParameters
                //{
                //    ValidateIssuerSigningKey = true,
                //    IssuerSigningKey = new SymmetricSecurityKey(key),
                //    ValidateIssuer = false,
                //    ValidateAudience = false,
                //    ClockSkew = TimeSpan.Zero,
                //    ValidateLifetime = true, // Включаем валидацию времени жизни
                //    RequireExpirationTime = true // Требуем наличие времени истечения
                //}, out SecurityToken validatedToken);

                //var jwtToken = (JwtSecurityToken)validatedToken;

                // Дополнительная проверка времени истечения
                //if (jwtToken.ValidTo < DateTime.UtcNow)
                if (data.expiry < DateTime.UtcNow)
                {
                    throw new UnauthorizedAccessException("Срок действия ссылки истек");
                }

                return new DocumentData
                {
                    Inn = data.inn,
                    Date = data.ToString(),
                    Guid = data.guid
                };
            }
            catch (SecurityTokenExpiredException)
            {
                throw new UnauthorizedAccessException("Срок действия ссылки истек");
            }
            catch (SecurityTokenValidationException ex)
            {
                throw new UnauthorizedAccessException("Недействительный токен", ex);
            }
            catch (Exception ex)
            {
                throw new UnauthorizedAccessException("Ошибка при проверке токена", ex);
            }
        }

        public async Task<Result<byte[]>> AddWatermarkToPdfAsync(byte[] inputPdfBytes, string watermarkText, float opacity = 0.3f)
        {
            try
            {
                using (var inputStream = new MemoryStream(inputPdfBytes))
                using (var outputStream = new MemoryStream())
                {
                    var result = await AddWatermarkToPdfAsync(inputStream, outputStream, watermarkText, opacity);

                    if (result.IsFailed)
                    {
                        return Result.Fail(result.Errors);
                    }

                    return Result.Ok(outputStream.ToArray());
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding watermark to PDF");
                return Result.Fail(new Error("Failed to add watermark to PDF")
                    .WithMetadata("ErrorCode", "WATERMARK_FAILED")
                    .WithMetadata("ErrorDetails", ex.Message));
            }
        }

        public async Task<Result> AddWatermarkToPdfAsync(Stream inputStream, Stream outputStream, string watermarkText, float opacity = 0.3f)
        {
            try
            {
                // Используем Task.Run для выполнения синхронных операций iText асинхронно
                return await Task.Run(() =>
                {
                    // Инициализация BouncyCastle для iText

                    using (var reader = new PdfReader(inputStream))
                    using (var writer = new PdfWriter(outputStream))
                    using (var pdfDoc = new PdfDocument(reader, writer))
                    {
                        // Получаем количество страниц
                        int numberOfPages = pdfDoc.GetNumberOfPages();

                        // Подготавливаем внешний вид водяного знака
                        PdfFont font = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);
                        DeviceRgb watermarkColor = new DeviceRgb(128, 128, 128); // Серый цвет

                        // Добавляем водяной знак на каждую страницу
                        for (int i = 1; i <= numberOfPages; i++)
                        {
                            PdfPage page = pdfDoc.GetPage(i);
                            Rectangle pageSize = page.GetPageSize();

                            // Создаём новый canvas для водяного знака
                            PdfCanvas pdfCanvas = new PdfCanvas(page.NewContentStreamAfter(), page.GetResources(), pdfDoc);

                            // Создаём прозрачное состояние
                            pdfCanvas.SaveState();
                            // Устанавливаем прозрачность через графическое состояние
                            var gState = new PdfExtGState().SetFillOpacity(opacity);
                            pdfCanvas.SetExtGState(gState);

                            // Создаём документный canvas для высокоуровневых операций
                            iText.Layout.Canvas canvas = new iText.Layout.Canvas(pdfCanvas, pageSize);

                            // Создаём элемент текста водяного знака
                            Text text = new Text(watermarkText)
                                        .SetFont(font)
                                        .SetFontSize(60)
                                        .SetFontColor(watermarkColor);

                            // Создаём параграф для размещения текста
                            Paragraph paragraph = new Paragraph(text)
                                        .SetTextAlignment(TextAlignment.CENTER)
                                        .SetRotationAngle(Math.PI / 4); // 45 градусов в радианах

                            // Добавляем параграф на canvas по центру страницы
                            float centerX = pageSize.GetWidth() / 2;
                            float centerY = pageSize.GetHeight() / 2;

                            // Позиционируем параграф в центре страницы
                            paragraph.SetFixedPosition(
                                centerX - 200, // Позиция X
                                centerY - 100, // Позиция Y
                                400 // Ширина
                            );

                            canvas.Add(paragraph);
                            canvas.Close();

                            // Восстанавливаем графическое состояние
                            pdfCanvas.RestoreState();
                        }
                    }

                    return Result.Ok();
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding watermark to PDF");
                return Result.Fail(new Error("Failed to add watermark to PDF")
                    .WithMetadata("ErrorCode", "WATERMARK_FAILED")
                    .WithMetadata("ErrorDetails", ex.Message));
            }
        }

        public async Task<Result<byte[]>> AddHtmlStampToPdfAsync(byte[] inputPdfBytes, string htmlContent)
        {
            try
            {
                return await Task.Run(() =>
                {
                    // Инициализация BouncyCastle

                    using (MemoryStream inputStream = new MemoryStream(inputPdfBytes))
                    using (MemoryStream outputStream = new MemoryStream())
                    {
                        using (PdfReader reader = new PdfReader(inputStream))
                        using (PdfWriter writer = new PdfWriter(outputStream))
                        using (PdfDocument pdfDoc = new PdfDocument(reader, writer))
                        {
                            // Применяем HTML-штамп ко всем страницам
                            int numberOfPages = pdfDoc.GetNumberOfPages();
                            for (int i = 1; i <= numberOfPages; i++)
                            {
                                PdfPage page = pdfDoc.GetPage(i);
                                AddHtmlStampToPage(pdfDoc, page, htmlContent);
                            }
                        }

                        return Result.Ok(outputStream.ToArray());
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding HTML stamp to PDF");
                return Result.Fail(new Error("Failed to add HTML stamp to PDF")
                    .WithMetadata("ErrorCode", "HTML_STAMP_FAILED")
                    .WithMetadata("ErrorDetails", ex.Message));
            }
        }

        public async Task<Result<byte[]>> AddSignatureStampToPdfAsync(byte[] inputPdfBytes, string signatureInfo)
        {
            // Формируем HTML для штампа с подписью
            string htmlContent = $@"
<div style='border: 1px solid black; padding: 10px; width: 480px; font-family: Arial, sans-serif;'>
    {string.Join("<br/>", signatureInfo.Split('\n').Select(line => $"<p style='margin: 0; font-size: 12px;'>{line}</p>"))}
</div>";

            return await AddHtmlStampToPdfAsync(inputPdfBytes, htmlContent);
        }
        private void AddHtmlStampToPage(PdfDocument pdfDoc, PdfPage page, string htmlContent)
        {
            // Получаем размеры страницы
            Rectangle pageSize = page.GetPageSize();

            // Создаём временный MemoryStream для хранения HTML -> PDF конвертации
            using (MemoryStream htmlPdfStream = new MemoryStream())
            {
                // Создаём новый документ для HTML
                using (PdfWriter htmlWriter = new PdfWriter(htmlPdfStream))
                using (PdfDocument htmlDoc = new PdfDocument(htmlWriter))
                {
                    // Настраиваем конвертер HTML
                    ConverterProperties converterProperties = new ConverterProperties();

                    // Конвертируем HTML в PDF
                    HtmlConverter.ConvertToPdf(htmlContent, htmlDoc, converterProperties);
                }

                // Получаем байты сконвертированного PDF
                byte[] pdfBytes = htmlPdfStream.ToArray();

                // Создаём PDF-документ из байтов
                using (MemoryStream pdfStream = new MemoryStream(pdfBytes))
                using (PdfReader pdfReader = new PdfReader(pdfStream))
                using (PdfDocument tempDoc = new PdfDocument(pdfReader))
                {
                    // Получаем первую страницу из HTML-документа
                    PdfPage htmlPage = tempDoc.GetPage(1);

                    // Получаем фактические размеры сконвертированного HTML
                    float htmlWidth = htmlPage.GetPageSize().GetWidth();
                    float htmlHeight = htmlPage.GetPageSize().GetHeight();

                    // Создаём Form XObject из страницы
                    PdfFormXObject formXObject = htmlPage.CopyAsFormXObject(pdfDoc);

                    // Создаём новый canvas для основного документа
                    PdfCanvas pdfCanvas = new PdfCanvas(page.NewContentStreamAfter(), page.GetResources(), pdfDoc);

                    // Сохраняем состояние графического контекста
                    pdfCanvas.SaveState();

                    // Отступы от краев
                    float margin = 20;

                    // Позиция штампа (внизу справа)
                    float x = pageSize.GetWidth() - htmlWidth - margin;
                    float y = margin;

                    // Добавляем HTML как Form XObject
                    pdfCanvas.AddXObjectAt(formXObject, x, y);

                    // Восстанавливаем состояние графического контекста
                    pdfCanvas.RestoreState();
                }
            }
        }
        public async Task<Result<byte[]>> AddSignatureStampDirectlyToPdfAsync(byte[] inputPdfBytes, List<string> signatureInfo, string docGuid, int docId)
        {
            try
            {
                return await Task.Run(() =>
                {
                    // Инициализация BouncyCastle

                    using (MemoryStream inputStream = new MemoryStream(inputPdfBytes))
                    using (MemoryStream outputStream = new MemoryStream())
                    {
                        using (PdfReader reader = new PdfReader(inputStream))
                        using (PdfWriter writer = new PdfWriter(outputStream))
                        using (PdfDocument pdfDoc = new PdfDocument(reader, writer))
                        {
                            // Применяем штамп ко всем страницам
                            int numberOfPages = pdfDoc.GetNumberOfPages();
                            for (int i = 1; i <= numberOfPages; i++)
                            {
                                PdfPage page = pdfDoc.GetPage(i);
                                if (docId == 155)
                                {
                                //    //AddDirectSignatureStampToPageTop(pdfDoc, page, signatureInfo, docGuid, docId);
                                }
                                else 
                                    AddDirectSignatureStampToPage(pdfDoc, page, signatureInfo, docGuid, docId);
                            }
                        }

                        return Result.Ok(outputStream.ToArray());
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding signature stamp to PDF");
                return Result.Fail(new Error("Failed to add signature stamp to PDF")
                    .WithMetadata("ErrorCode", "SIGNATURE_STAMP_FAILED")
                    .WithMetadata("ErrorDetails", ex.Message));
            }
        }

        private void AddDirectSignatureStampToPageTop(PdfDocument pdfDoc, PdfPage page, List<string> signatureInfo, string docGuid, int docId)
        {
            // Получаем размеры страницы
            Rectangle pageSize = page.GetPageSize();

            // Настройки штампа
            float stampWidth = 200;
            float stampHeight = 85;
            float margin = 5; // Уменьшаем отступ для максимального приближения к углу
            float qrCodeSize = 70;
            float borderWidth = 1f;

            // Позиция штампа (вверху справа)
            float x = pageSize.GetWidth() - stampWidth - margin;
            float y = pageSize.GetHeight() - stampHeight - margin; // Изменено: теперь отсчитываем от верха страницы

            // Используем обычный конструктор PdfCanvas
            PdfCanvas pdfCanvas = new PdfCanvas(page);

            // Добавляем полупрозрачный белый фон
            PdfExtGState gs1 = new PdfExtGState();
            gs1.SetFillOpacity(0.7f);
            pdfCanvas.SaveState();
            pdfCanvas.SetExtGState(gs1);
            pdfCanvas.SetFillColor(ColorConstants.WHITE);
            pdfCanvas.Rectangle(x, y, stampWidth, stampHeight);
            pdfCanvas.Fill();
            pdfCanvas.RestoreState();

            // Рисуем рамку с полной непрозрачностью
            pdfCanvas.SaveState();
            pdfCanvas.SetStrokeColor(ColorConstants.GRAY);
            pdfCanvas.SetLineWidth(borderWidth);
            float offset = borderWidth / 2;
            pdfCanvas.Rectangle(
                x + offset,
                y + offset,
                stampWidth - borderWidth,
                stampHeight - borderWidth
            );
            pdfCanvas.Stroke();
            pdfCanvas.RestoreState();

            // Создаём документный canvas для текста
            iText.Layout.Canvas canvas = new iText.Layout.Canvas(pdfCanvas, pageSize);

            PdfFont font;

            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                font = PdfFontFactory.CreateFont("c:/windows/fonts/arial.ttf", PdfEncodings.IDENTITY_H);
            }
            else
            {
                font = PdfFontFactory.CreateFont("/app/fonts/arial.ttf", PdfEncodings.IDENTITY_H);
            }

            // Создаём и добавляем QR-код
            BarcodeQRCode qrCode = new BarcodeQRCode(_apiCabinetUrl + "/secure-document-download?guid=" + docGuid);
            PdfFormXObject qrCodeForm = qrCode.CreateFormXObject(ColorConstants.BLACK, pdfDoc);

            // QR-код позиционируем справа внутри штампа
            Image qrCodeImage = new Image(qrCodeForm)
                .SetWidth(qrCodeSize)
                .SetHeight(qrCodeSize)
                .SetFixedPosition(x + stampWidth - qrCodeSize - 10, y + 10);
            canvas.Add(qrCodeImage);

            // Создаём контейнер для текста с фиксированной позицией
            Div textContainer = new Div()
                .SetFixedPosition(x + 10, y + 10, stampWidth - qrCodeSize - 30)
                .SetHeight(stampHeight - 20);

            // Добавляем строки текста
            for (int i = 0; i < signatureInfo.Count; i++)
            {
                Paragraph line = new Paragraph(signatureInfo[i])
                    .SetFont(font)
                    .SetFontSize(10)
                    .SetFontColor(ColorConstants.BLACK)
                    .SetMargin(0)
                    .SetPadding(0);

                if (i < signatureInfo.Count - 1)
                {
                    line.SetMarginBottom(2); // Небольшой отступ между строками
                }

                textContainer.Add(line);
            }

            canvas.Add(textContainer);
            canvas.Close();
        }
        private void AddDirectSignatureStampToPage(PdfDocument pdfDoc, PdfPage page, List<string> signatureInfo, string docGuid, int docId)
        {
            // Получаем размеры страницы
            Rectangle pageSize = page.GetPageSize();

            // Настройки штампа
            float stampWidth = 200;
            float stampHeight = 85;
            float margin = 10;
            float qrCodeSize = 70;
            float borderWidth = 1f;

            // Позиция штампа (внизу справа)
            float x = pageSize.GetWidth() - stampWidth - margin;
            float y = margin; // Это правильно - внизу страницы

            // Используем обычный конструктор PdfCanvas
            PdfCanvas pdfCanvas = new PdfCanvas(page);

            // Добавляем полупрозрачный белый фон
            PdfExtGState gs1 = new PdfExtGState();
            gs1.SetFillOpacity(0.7f);
            pdfCanvas.SaveState();
            pdfCanvas.SetExtGState(gs1);
            pdfCanvas.SetFillColor(ColorConstants.WHITE);
            pdfCanvas.Rectangle(x, y, stampWidth, stampHeight);
            pdfCanvas.Fill();
            pdfCanvas.RestoreState();

            // Рисуем рамку с полной непрозрачностью
            pdfCanvas.SaveState();
            pdfCanvas.SetStrokeColor(ColorConstants.GRAY);
            pdfCanvas.SetLineWidth(borderWidth);
            float offset = borderWidth / 2;
            pdfCanvas.Rectangle(
                x + offset,
                y + offset,
                stampWidth - borderWidth,
                stampHeight - borderWidth
            );
            pdfCanvas.Stroke();
            pdfCanvas.RestoreState();

            // Создаём документный canvas для текста
            iText.Layout.Canvas canvas = new iText.Layout.Canvas(pdfCanvas, pageSize);

            PdfFont font;

            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                font = PdfFontFactory.CreateFont("c:/windows/fonts/arial.ttf", PdfEncodings.IDENTITY_H);
            }
            else
            {
                font = PdfFontFactory.CreateFont("/app/fonts/arial.ttf", PdfEncodings.IDENTITY_H);
            }
            // Загружаем шрифт с поддержкой кириллицы
            //PdfFont font = PdfFontFactory.CreateFont("c:/windows/fonts/arial.ttf", PdfEncodings.IDENTITY_H);
            //PdfFont font = PdfFontFactory.CreateFont(StandardFonts.TIMES_ROMAN, PdfEncodings.IDENTITY_H);

            // Создаём и добавляем QR-код
            BarcodeQRCode qrCode = new BarcodeQRCode(_apiCabinetUrl + "/secure-document-download?guid=" + docGuid);
            PdfFormXObject qrCodeForm = qrCode.CreateFormXObject(ColorConstants.BLACK, pdfDoc);

            // QR-код позиционируем справа внутри штампа
            Image qrCodeImage = new Image(qrCodeForm)
                .SetWidth(qrCodeSize)
                .SetHeight(qrCodeSize)
                .SetFixedPosition(x + stampWidth - qrCodeSize - 10, y + 10);
            canvas.Add(qrCodeImage);

            // Создаём контейнер для текста с фиксированной позицией
            Div textContainer = new Div()
                .SetFixedPosition(x + 10, y + 10, stampWidth - qrCodeSize - 30)
                .SetHeight(stampHeight - 20);

            // Добавляем строки текста
            for (int i = 0; i < signatureInfo.Count; i++)
            {
                Paragraph line = new Paragraph(signatureInfo[i])
                    .SetFont(font)
                    .SetFontSize(10)
                    .SetFontColor(ColorConstants.BLACK)
                    .SetMargin(0)
                    .SetPadding(0);

                if (i < signatureInfo.Count - 1)
                {
                    line.SetMarginBottom(2); // Небольшой отступ между строками
                }

                textContainer.Add(line);
            }

            canvas.Add(textContainer);
            canvas.Close();
        }
    }
}