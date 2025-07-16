using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.UseCases
{
    public class FeedbackUseCases
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly EmployeeUseCases _employeeUseCases;
        private readonly ILogger<FeedbackUseCases> _logger;
        private readonly ISendNotification _sendNotification;

        public FeedbackUseCases(IUnitOfWork unitOfWork, EmployeeUseCases employeeUseCases, ILogger<FeedbackUseCases> logger, ISendNotification sendNotification)
        {
            _unitOfWork = unitOfWork;
            _employeeUseCases = employeeUseCases;
            _logger = logger;
            _sendNotification = sendNotification;
        }
        
        public async Task<Feedback> Create(FeedbackCreateRequest domain)
        {
            var currentUser = await _employeeUseCases.GetUser();

            var feedback = new Feedback
            {
                record_date = DateTime.Now,
                description = domain.Description,
                employee_id = currentUser.id,
            };
            var feedbackId = await _unitOfWork.FeedbackRepository.Add(feedback);
            
            foreach (var file in domain.Files)
            {
                var file_id = await _unitOfWork.FileRepository.Add(file);
                await _unitOfWork.FeedbackFilesRepository.Add(new FeedbackFiles
                {
                    file_id = file_id,
                    feedback_id = feedbackId,
                });
            }
            
            _unitOfWork.Commit();
            
            try
            {
                await _sendNotification.SendFeedback(
                    feedback.record_date.ToString("dd-MM-yyyy hh:mm:ss"),
                    $"{currentUser.last_name} {currentUser.first_name} {currentUser.second_name}",
                    feedback.description,
                    domain.Files.Count);
            }
            catch (Exception e)
            {
                _logger.LogError($"An unexpected error occurred. {e.Message}");
            }
            
            return new Feedback
            {
                record_date = DateTime.Now,
                description = domain.Description,
            };
        }
    }
}
