using Domain;
using FluentResults;
using Microsoft.AspNetCore.Mvc;

public static class ActionResultHelper
{
    public static IActionResult FromResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            return new OkObjectResult(result.Value);
        }

        var firstError = result.Errors.FirstOrDefault();
        if (firstError is CustomError customError)
        {
            var errorResponse = new
            {
                Code = customError.ErrorType.ToString(),
                Message = customError.Message,
                customError.Parameters,
            };

            return new ObjectResult(errorResponse)
            {
                StatusCode = customError.StatusCode
            };
        }

        // На случай, если ошибка не была обработана кастомно
        return new ObjectResult(new { Code = "UNKNOWN", Message = firstError?.Message ?? "An unknown error occurred" })
        {
            StatusCode = 500
        };
    }
}
