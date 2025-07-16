using Application.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class UploadedApplicationDocumentUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public UploadedApplicationDocumentUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<UploadedApplicationDocument>> GetAll()
        {
            return unitOfWork.UploadedApplicationDocumentRepository.GetAll();
        }
        public async Task<List<UploadedApplicationDocumentToCabinet>> GetUploadsByGuidCabinet(string guid)
        {
            var app = await unitOfWork.ApplicationRepository.GetOneByGuid(guid);
            if (app == null) return new List<UploadedApplicationDocumentToCabinet>();

            var res = await unitOfWork.UploadedApplicationDocumentRepository.GetUpoadsToCabinetById(app.id);

            return res;
        }

        public Task<UploadedApplicationDocument> GetOneByID(int id)
        {
            return unitOfWork.UploadedApplicationDocumentRepository.GetOneByID(id);
        }
    }
}
