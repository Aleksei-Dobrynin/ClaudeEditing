using System.Text.Json;
using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationRoadUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IAuthRepository _authRepository;

        public ApplicationRoadUseCases(IUnitOfWork unitOfWork, IAuthRepository authRepository)
        {
            this.unitOfWork = unitOfWork;
            _authRepository = authRepository;
        }

        public async Task<List<ApplicationRoad>> GetAll()
        {
            var appRoads = await unitOfWork.ApplicationRoadRepository.GetAll();
            var userRoles = await _authRepository.GetMyRoles();
            
            foreach (var appRoad in appRoads)
            {
                appRoad.is_allowed = true;
                if (appRoad.roles != null && appRoad.roles != "[]")
                {
                    var roles = JsonSerializer.Deserialize<List<string>>(appRoad.roles ?? "[]");
                    appRoad.is_allowed = userRoles.Any(role => roles.Contains(role));
                }
            }
            return appRoads;
        }
        
        public async Task<ApplicationRoad> GetOneByID(int id)
        {
            var item = await unitOfWork.ApplicationRoadRepository.GetOneByID(id);
            if (item.group_id != null)
            {
                var roles = await unitOfWork.StructurePostRepository.GetAll();
                var groups = await unitOfWork.ApplicationRoadGroupsRepository.GetOneByID(item.group_id.Value);
                var groupRoles = JsonSerializer.Deserialize<List<string>>(groups.roles ?? "[]");
                item.posts = roles
                    .Where(r => groupRoles.Contains(r.code))
                    .Select(r => r.id)
                    .ToArray();
            }
            return item;
        }

        public async Task<ApplicationRoad> Create(ApplicationRoad domain)
        {
            var roles = await unitOfWork.StructurePostRepository.GetAll();
            var groupsId = await unitOfWork.ApplicationRoadGroupsRepository.Add(new ApplicationRoadGroups
            {
                roles = JsonSerializer.Serialize(
                    roles
                        .Where(r => domain.posts != null && domain.posts.Contains(r.id))
                        .Select(r => r.code)
                        .ToList()
                )
            });
            domain.group_id = groupsId;
            var result = await unitOfWork.ApplicationRoadRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationRoad> Update(ApplicationRoad domain)
        {
            var roles = await unitOfWork.StructurePostRepository.GetAll();
            if (domain.group_id != null && domain.group_id != 0)
            {
                await unitOfWork.ApplicationRoadGroupsRepository.Update(new ApplicationRoadGroups
                {
                    id = domain.group_id.Value,
                    roles = JsonSerializer.Serialize(
                        roles
                            .Where(r => domain.posts != null && domain.posts.Contains(r.id))
                            .Select(r => r.code)
                            .ToList()
                    )
                });
            }
            else
            {
                var groupsId = await unitOfWork.ApplicationRoadGroupsRepository.Add(new ApplicationRoadGroups
                {
                    roles = JsonSerializer.Serialize(
                        roles
                            .Where(r => domain.posts != null && domain.posts.Contains(r.id))
                            .Select(r => r.code)
                            .ToList()
                    )
                });
                domain.group_id = groupsId;
            }
            await unitOfWork.ApplicationRoadRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationRoadRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
