using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Domain.Entities;
using File = Domain.Entities.File;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly FeedbackUseCases _FeedbackUseCases;

        public FeedbackController(FeedbackUseCases FeedbackUseCases)
        {
            _FeedbackUseCases = FeedbackUseCases;
        }
        
        [HttpPost]
        public async Task<IActionResult> SubmitFeedback([FromForm] FeedbackRequest feedbackRequest)
        {
            var newFeedback = new FeedbackCreateRequest
            {
                Description = feedbackRequest.Description,
                Files = new List<File>(),
            };

            if (feedbackRequest.Files != null)
                foreach (var file in feedbackRequest.Files)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        file.CopyTo(memoryStream);
                        newFeedback.Files.Add(new File
                        {
                            name = file.FileName,
                            body = memoryStream.ToArray()
                        });
                    }
                }

            var response = await _FeedbackUseCases.Create(newFeedback);
            return Ok(response);
        }
    }
}
