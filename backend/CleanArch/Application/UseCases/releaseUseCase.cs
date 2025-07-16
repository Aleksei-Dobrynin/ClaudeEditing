using Application.Models;
using Application.Repositories;
using DocumentFormat.OpenXml.Office2010.Excel;
using Domain.Entities;

namespace Application.UseCases
{
    public class releaseUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public releaseUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<release>> GetAll()
        {
            return unitOfWork.releaseRepository.GetAll();
        }
        public Task<List<release>> GetReleaseds()
        {
            return unitOfWork.releaseRepository.GetReleaseds();
        }
        public async Task<release> GetOne(int id)
        {
            var res = await unitOfWork.releaseRepository.GetOne(id);
            var videos = await unitOfWork.release_videoRepository.GetByrelease_id(id);
            res.videos = videos;

            return res;
        }
        public async Task<release> GetLastRelease()
        {
            var res = await unitOfWork.releaseRepository.GetLastRelease();
            var videos = await unitOfWork.release_videoRepository.GetByrelease_id(res.id);
            res.videos = videos;

            return res;
        }
        public async Task<release> ApproveRelease(int id)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            var res = await unitOfWork.releaseRepository.GetOne(id);

            await unitOfWork.release_seenRepository.Add(new release_seen
            {
                release_id = id,
                user_id = user_id,
                created_at = DateTime.Now,
                created_by = user_id,
                date_issued = DateTime.Now,
            });

            unitOfWork.Commit();

            return res;
        }
        public async Task<release> Create(release domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.created_by = user_id;
            domain.created_at = DateTime.Now;

            var result = await unitOfWork.releaseRepository.Add(domain);
            domain.id = result;

            foreach (var file in domain.files)
            {
                var document = unitOfWork.FileRepository.AddDocument(file);
                var id_file = await unitOfWork.FileRepository.Add(document);
                file.id = id_file;

                await unitOfWork.release_videoRepository.Add(new release_video
                {
                    release_id = result,
                    file_id = file.id,
                    created_by = user_id,
                    created_at = DateTime.Now,
                });
            }



            unitOfWork.Commit();
            return domain;
        }

        public async Task<release> Update(release domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.updated_by = user_id;
            domain.updated_at = DateTime.Now;



            var videos = await unitOfWork.release_videoRepository.GetByrelease_id(domain.id);
            List<int> numbers = domain.video_ids?
                .Split(',')               // Разделяем строку по запятым
                .Select(int.Parse)        // Преобразуем каждую часть в число
                .ToList() ?? new List<int>();

            //var curr_ids = domain.videos.Select(x => x.id);
            var for_delete = videos.Where(x => !numbers.Contains(x.id)).ToList();
            foreach (var item in for_delete)
            {
                await unitOfWork.release_videoRepository.Delete(item.id);
            }

            foreach (var file in domain.files)
            {
                var document = unitOfWork.FileRepository.AddDocument(file);
                var id_file = await unitOfWork.FileRepository.Add(document);
                file.id = id_file;

                await unitOfWork.release_videoRepository.Add(new release_video
                {
                    release_id = domain.id,
                    file_id = file.id,
                    created_by = user_id,
                    created_at = DateTime.Now,
                });
            }

            await unitOfWork.releaseRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<release>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.releaseRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            var videos = await unitOfWork.release_videoRepository.GetByrelease_id(id);
            var seens = await unitOfWork.release_seenRepository.GetByrelease_id(id);

            foreach (var item in videos)
            {
                await unitOfWork.release_videoRepository.Delete(item.id);
            }
            foreach (var item in seens)
            {
                await unitOfWork.release_seenRepository.Delete(item.id);
            }

            await unitOfWork.releaseRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
