using Application.Repositories;
using Dapper;
using Domain;
using Domain.Entities;
using Infrastructure.Repositories;
using System.Data;
using System.Data.Common;

namespace Infrastructure.FillLogData
{
    public static class FillLogDataHelper
    {
           public static  async Task FillLogDataCreate(BaseLogDomain domain, int userId)
        {
            domain.created_by = userId;
            domain.created_at = DateTime.Now;
            domain.updated_by = userId;
            domain.updated_at = DateTime.Now;
        }

        public static async Task FillLogDataUpdate(BaseLogDomain domain, int userId)
        {

            domain.updated_by = userId;
            domain.updated_at = DateTime.Now;
        }
    }
}
