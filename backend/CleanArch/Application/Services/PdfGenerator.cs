// Установите: Install-Package SelectPdf
using iText.Kernel.Pdf;


namespace Application.Services
{
    public interface IPdfGenerator
    {
        byte[] GeneratePdf(string html);
    }
    public class PdfGenerator : IPdfGenerator
    {
        public byte[] GeneratePdf(string html)
        {
            if (string.IsNullOrEmpty(html))
                throw new ArgumentException("HTML content cannot be null or empty", nameof(html));

           return new byte[0];
        }
    }
}

// Регистрация в DI (Program.cs)
// builder.Services.AddScoped<IPdfGenerator, PdfGenerator>();