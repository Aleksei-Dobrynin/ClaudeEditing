using Application.Exceptions;
using Application.Repositories;
using Dapper;
using Domain.Entities;
using Infrastructure.Data.Models;
using Infrastructure.FillLogData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class CustomSubscribtionRepository : ICustomSubscribtionRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository? _userRepository;
        public CustomSubscribtionRepository(IDbConnection dbConnection, IUserRepository? userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        //public async Task<List<CustomSubscribtionIncludes>> GetAll()
        //{
        //    try
        //    {
        //        var sql = "SELECT cs.*, sch.* , st.*, rt.* FROM \"CustomSubscribtion\" cs LEFT JOIN \"ScheduleType\" sch ON cs.\"idSchedule\" = sch.id LEFT JOIN \"SubscriberType\" st ON cs.\"idSubscriberType\" = st.id LEFT JOIN \"RepeatType\" rt ON cs.\"idRepeatType\" = rt.id";

        //        var models = await _dbConnection.QueryAsync<CustomSubscribtionIncludes, ScheduleType, SubscriberType, RepeatType, CustomSubscribtionIncludes>(
        //            sql,
        //            (customSubscribtion, scheduleType, subscriberType, repeatType) =>
        //            {
        //                customSubscribtion.idScheduleNav = scheduleType;
        //                customSubscribtion.idSubscriberTypeNav = subscriberType;
        //                customSubscribtion.idRepeatTypeNav = repeatType;
        //                return customSubscribtion;
        //            },
        //            splitOn: "id, id, id",
        //            transaction: _dbTransaction
        //        );

        //        return models.ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new RepositoryException("Failed to get CustomSubscribtion", ex);
        //    }
        //}

        public async Task<List<CustomSubscribtionIncludes>> GetAll()
        {
            try
            {
                var customSubscribtions = (await _dbConnection.QueryAsync<CustomSubscribtionIncludes>("SELECT * FROM \"CustomSubscribtion\"", transaction: _dbTransaction)).ToList();

                var scheduleIds = customSubscribtions.Select(cs => cs.idSchedule).Distinct().ToList();
                var subscriberIds = customSubscribtions.Select(cs => cs.idSubscriberType).Distinct().ToList();
                var repeatIds = customSubscribtions.Select(cs => cs.idRepeatType).Distinct().ToList();
                var documentIds = customSubscribtions.Select(cs => cs.idDocument).Distinct().ToList();
                var customSubscribtionsIds = customSubscribtions.Select(cs => cs.id).Distinct().ToList();

                var scheduleTypes = await _dbConnection.QueryAsync<ScheduleType>("SELECT * FROM \"ScheduleType\" WHERE id = ANY(@Ids)", new { Ids = scheduleIds.ToArray() }, transaction: _dbTransaction);
                var subscriberTypes = await _dbConnection.QueryAsync<SubscriberType>("SELECT * FROM \"SubscriberType\" WHERE id = ANY(@Ids)", new { Ids = subscriberIds.ToArray() }, transaction: _dbTransaction);
                var repeatTypes = await _dbConnection.QueryAsync<RepeatType>("SELECT * FROM \"RepeatType\" WHERE id = ANY(@Ids)", new { Ids = repeatIds.ToArray() }, transaction: _dbTransaction);
                var document = await _dbConnection.QueryAsync<S_DocumentTemplate>("SELECT * FROM \"S_DocumentTemplate\" WHERE id = ANY(@Ids)", new { Ids = documentIds.ToArray() }, transaction: _dbTransaction);
                var subscribtionContactType = await _dbConnection.QueryAsync<SubscribtionContactType>("SELECT * FROM \"SubscribtionContactType\" WHERE \"idSubscribtion\" = ANY(@Ids)", new { Ids = customSubscribtionsIds.ToArray() }, transaction: _dbTransaction);

                foreach (var customSubscribtion in customSubscribtions)
                {
                    customSubscribtion.idScheduleNav = scheduleTypes.FirstOrDefault(s => s.id == customSubscribtion.idSchedule);
                    customSubscribtion.idSubscriberTypeNav = subscriberTypes.FirstOrDefault(s => s.id == customSubscribtion.idSubscriberType);
                    customSubscribtion.idRepeatTypeNav = repeatTypes.FirstOrDefault(r => r.id == customSubscribtion.idRepeatType);
                    customSubscribtion.idDocumentNav = document.FirstOrDefault(r => r.id == customSubscribtion.idDocument);
                    customSubscribtion.idSubscribtionContactType = subscribtionContactType.FirstOrDefault(r => r.idSubscribtion == customSubscribtion.id);
                }

                return customSubscribtions;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomSubscribtion", ex);
            }
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByIdEmployee(int id)
        {
            try
            {
                var customSubscribtions = (await _dbConnection.QueryAsync<CustomSubscribtionIncludes>("SELECT * FROM \"CustomSubscribtion\" WHERE \"idEmployee\" = @IdEmployee", new { IdEmployee = id }, transaction: _dbTransaction)).ToList();

                var scheduleIds = customSubscribtions.Select(cs => cs.idSchedule).Distinct().ToList();
                var subscriberIds = customSubscribtions.Select(cs => cs.idSubscriberType).Distinct().ToList();
                var repeatIds = customSubscribtions.Select(cs => cs.idRepeatType).Distinct().ToList();
                var documentIds = customSubscribtions.Select(cs => cs.idDocument).Distinct().ToList();
                var customSubscribtionsIds = customSubscribtions.Select(cs => cs.id).Distinct().ToList();

                var scheduleTypes = await _dbConnection.QueryAsync<ScheduleType>("SELECT * FROM \"ScheduleType\" WHERE id = ANY(@Ids)", new { Ids = scheduleIds.ToArray() }, transaction: _dbTransaction);
                var subscriberTypes = await _dbConnection.QueryAsync<SubscriberType>("SELECT * FROM \"SubscriberType\" WHERE id = ANY(@Ids)", new { Ids = subscriberIds.ToArray() }, transaction: _dbTransaction);
                var repeatTypes = await _dbConnection.QueryAsync<RepeatType>("SELECT * FROM \"RepeatType\" WHERE id = ANY(@Ids)", new { Ids = repeatIds.ToArray() }, transaction: _dbTransaction);
                var document = await _dbConnection.QueryAsync<S_DocumentTemplate>("SELECT * FROM \"S_DocumentTemplate\" WHERE id = ANY(@Ids)", new { Ids = documentIds.ToArray() }, transaction: _dbTransaction);
                var subscribtionContactType = await _dbConnection.QueryAsync<SubscribtionContactType>("SELECT * FROM \"SubscribtionContactType\" WHERE \"idSubscribtion\" = ANY(@Ids)", new { Ids = customSubscribtionsIds.ToArray() }, transaction: _dbTransaction);

                foreach (var customSubscribtion in customSubscribtions)
                {
                    customSubscribtion.idScheduleNav = scheduleTypes.FirstOrDefault(s => s.id == customSubscribtion.idSchedule);
                    customSubscribtion.idSubscriberTypeNav = subscriberTypes.FirstOrDefault(s => s.id == customSubscribtion.idSubscriberType);
                    customSubscribtion.idRepeatTypeNav = repeatTypes.FirstOrDefault(r => r.id == customSubscribtion.idRepeatType);
                    customSubscribtion.idDocumentNav = document.FirstOrDefault(r => r.id == customSubscribtion.idDocument);
                    customSubscribtion.idSubscribtionContactType = subscribtionContactType.FirstOrDefault(r => r.idSubscribtion == customSubscribtion.id);
                }

                return customSubscribtions;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomSubscribtion", ex);
            }
        }


        public async Task<CustomSubscribtionIncludes> GetOneById(int id)
        {
            try
            {
                var customSubscribtion = await _dbConnection.QuerySingleOrDefaultAsync<CustomSubscribtionIncludes>(
                    "SELECT * FROM \"CustomSubscribtion\" WHERE \"id\" = @Id",
                    new { Id = id },
                    transaction: _dbTransaction
                );

                if (customSubscribtion == null)
                {
                    return null; 
                }

                var scheduleType = await _dbConnection.QuerySingleOrDefaultAsync<ScheduleType>(
                    "SELECT * FROM \"ScheduleType\" WHERE id = @Id",
                    new { Id = customSubscribtion.idSchedule },
                    transaction: _dbTransaction
                );

                var subscriberType = await _dbConnection.QuerySingleOrDefaultAsync<SubscriberType>(
                    "SELECT * FROM \"SubscriberType\" WHERE id = @Id",
                    new { Id = customSubscribtion.idSubscriberType },
                    transaction: _dbTransaction
                );

                var repeatType = await _dbConnection.QuerySingleOrDefaultAsync<RepeatType>(
                    "SELECT * FROM \"RepeatType\" WHERE id = @Id",
                    new { Id = customSubscribtion.idRepeatType },
                    transaction: _dbTransaction
                );

                var document = await _dbConnection.QuerySingleOrDefaultAsync<S_DocumentTemplate>(
                    "SELECT * FROM \"S_DocumentTemplate\" WHERE id = @Id",
                    new { Id = customSubscribtion.idDocument },
                    transaction: _dbTransaction
                );

                var subscribtionContactType = await _dbConnection.QuerySingleOrDefaultAsync<SubscribtionContactType>(
                   "SELECT * FROM \"SubscribtionContactType\" WHERE \"idSubscribtion\" = @Id",
                   new { Id = customSubscribtion.id },
                   transaction: _dbTransaction
               );


                customSubscribtion.idScheduleNav = scheduleType;
                customSubscribtion.idSubscriberTypeNav = subscriberType;
                customSubscribtion.idRepeatTypeNav = repeatType;
                customSubscribtion.idDocumentNav = document;
                customSubscribtion.idSubscribtionContactType = subscribtionContactType;
                return customSubscribtion;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomSubscribtion", ex);
            }
        }

        //public async Task<CustomSubscribtionIncludes> GetOneById(int id)
        //{
        //    try
        //    {
        //        var sql = "SELECT cs.*, st.*, rt.*, sch.* FROM \"CustomSubscribtion\" cs LEFT JOIN \"SubscriberType\" st ON cs.\"idSubscriberType\" = st.id LEFT JOIN \"RepeatType\" rt ON cs.\"idRepeatType\" = rt.id LEFT JOIN \"ScheduleType\" sch ON cs.\"idSchedule\" = sch.id WHERE cs.\"id\" = @Id";

        //        var model = await _dbConnection.QueryAsync<CustomSubscribtionIncludes, SubscriberType, RepeatType, ScheduleType, CustomSubscribtionIncludes>(
        //            sql,
        //            (customSubscribtion, subscriberType, repeatType, scheduleType) =>
        //            {
        //                customSubscribtion.idSubscriberTypeNav = subscriberType;
        //                customSubscribtion.idRepeatTypeNav = repeatType;
        //                customSubscribtion.idScheduleNav = scheduleType;
        //                return customSubscribtion;
        //            },
        //            new { Id = id },
        //            transaction: _dbTransaction
        //        );

        //        return model.FirstOrDefault();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new RepositoryException("Failed to get CustomSubscribtion", ex);
        //    }
        //}



        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM \"CustomSubscribtion\" WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id}, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete  CustomSubscribtion", ex);
            }
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByidSubscriberType(int idSubscriberType)
        {
            try
            {
                var sql = "SELECT cs.*, st.*, rt.*, sch.* FROM \"CustomSubscribtion\" cs LEFT JOIN \"SubscriberType\" st ON cs.\"idSubscriberType\" = st.id LEFT JOIN \"RepeatType\" rt ON cs.\"idRepeatType\" = rt.id LEFT JOIN \"ScheduleType\" sch ON cs.\"idSchedule\" = sch.id WHERE cs.\"idSubscriberType\" = @Id";

                var models = await _dbConnection.QueryAsync<CustomSubscribtionIncludes, SubscriberType, RepeatType, ScheduleType, CustomSubscribtionIncludes>(
                    sql,
                    (customSubscribtion, subscriberType, repeatType, scheduleType) =>
                    {
                        customSubscribtion.idSubscriberTypeNav = subscriberType;
                        customSubscribtion.idRepeatTypeNav = repeatType;
                        customSubscribtion.idScheduleNav = scheduleType;
                        return customSubscribtion;
                    },
                    new { Id = idSubscriberType },
                    transaction: _dbTransaction
                );

                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomSubscribtion", ex);
            }
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByidSchedule(int idSchedule)
        {
            try
            {
                var sql = "SELECT cs.*, st.*, rt.*, sch.* FROM \"CustomSubscribtion\" cs LEFT JOIN \"SubscriberType\" st ON cs.\"idSubscriberType\" = st.id LEFT JOIN \"RepeatType\" rt ON cs.\"idRepeatType\" = rt.id LEFT JOIN \"ScheduleType\" sch ON cs.\"idSchedule\" = sch.id WHERE cs.\"idSchedule\" = @Id";
                var models = await _dbConnection.QueryAsync<CustomSubscribtionIncludes, SubscriberType, RepeatType, ScheduleType, CustomSubscribtionIncludes>(
                   sql,
                   (customSubscribtion, subscriberType, repeatType, scheduleType) =>
                   {
                       customSubscribtion.idSubscriberTypeNav = subscriberType;
                       customSubscribtion.idRepeatTypeNav = repeatType;
                       customSubscribtion.idScheduleNav = scheduleType;
                       return customSubscribtion;
                   },
                   new { Id = idSchedule },
                   transaction: _dbTransaction
               );
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomSubscribtion", ex);
            }
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByidRepeatType(int idRepeatType)
        {
            try
            {
                var sql = "SELECT cs.*, st.*, rt.*, sch.* FROM \"CustomSubscribtion\" cs LEFT JOIN \"SubscriberType\" st ON cs.\"idSubscriberType\" = st.id LEFT JOIN \"RepeatType\" rt ON cs.\"idRepeatType\" = rt.id LEFT JOIN \"ScheduleType\" sch ON cs.\"idSchedule\" = sch.id WHERE cs.\"idRepeatType\" = @Id";
                var models = await _dbConnection.QueryAsync<CustomSubscribtionIncludes, SubscriberType, RepeatType, ScheduleType, CustomSubscribtionIncludes>(
                   sql,
                   (customSubscribtion, subscriberType, repeatType, scheduleType) =>
                   {
                       customSubscribtion.idSubscriberTypeNav = subscriberType;
                       customSubscribtion.idRepeatTypeNav = repeatType;
                       customSubscribtion.idScheduleNav = scheduleType;
                       return customSubscribtion;
                   },
                   new { Id = idRepeatType },
                   transaction: _dbTransaction
               );
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomSubscribtion", ex);
            }
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByidDocument(int idDocument)
        {
            try
            {
                var sql = "SELECT * FROM  \"CustomSubscribtion\" WHERE id = @Id";
                var models = await _dbConnection.QueryAsync<CustomSubscribtionIncludes>(sql, new { Id = idDocument }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomSubscribtion", ex);
            }
        }

        public async Task<List<CustomSubscribtionIncludes>> GetByidAutoChannel(int idAutoChannel)
        {
            try
            {
                var sql = "SELECT * FROM  \"CustomSubscribtion\" WHERE id = @Id";
                var models = await _dbConnection.QueryAsync<CustomSubscribtionIncludes>(sql, new { Id = idAutoChannel }, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get CustomSubscribtion", ex);
            }
        }
        public async Task<int> Add(CustomSubscribtion domain, SubscribtionContactType domainSubscribtionContactType)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new CustomSubscribtionModel
                {
                    idSubscriberType = domain.idSubscriberType,
                    idSchedule = domain.idSchedule,
                    idRepeatType = domain.idRepeatType,

                    sendEmpty = domain.sendEmpty,
                    timeStart = domain.timeStart,
                    timeEnd = domain.timeEnd,
                    monday = domain.monday,
                    tuesday = domain.tuesday,
                    wednesday = domain.wednesday,
                    thursday = domain.thursday,
                    friday = domain.friday,


                    saturday = domain.saturday,
                    sunday = domain.sunday,
                    dateOfMonth = domain.dateOfMonth,
                    weekOfMonth = domain.weekOfMonth,
                    isActive = domain.isActive,
                    idDocument = domain.idDocument,
                    activeDateStart = domain.activeDateStart,
                    activeDateEnd = domain.activeDateEnd,
                    body = domain.body,
                    title = domain.title,
                    idEmployee = domain.idEmployee,
                    idStructurePost = domain.idStructurePost
                };

                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = "INSERT INTO \"CustomSubscribtion\"(\"idSubscriberType\", \"idSchedule\", \"idRepeatType\", \"sendEmpty\", \"timeStart\", \"timeEnd\", \"monday\", \"tuesday\", \"wednesday\", \"thursday\", \"friday\", \"saturday\", \"sunday\", \"dateOfMonth\", \"weekOfMonth\", \"isActive\", \"idDocument\", \"activeDateStart\", \"activeDateEnd\", \"body\", \"title\", \"idEmployee\", \"created_at\", \"created_by\", \"updated_at\", \"updated_by\", \"idStructurePost\") " +
                    "VALUES (@idSubscriberType, @idSchedule, @idRepeatType, @sendEmpty, @timeStart, @timeEnd, @monday, @tuesday, @wednesday, @thursday, @friday, @saturday, @sunday, @dateOfMonth, @weekOfMonth, @isActive, @idDocument, @activeDateStart, @activeDateEnd, @body, @title, @idEmployee, @created_at, @created_by, @updated_at, @updated_by, @idStructurePost) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);

                 var modelSubscribtionContactType = new SubscribtionContactTypeModel
                {
                    idSubscribtion = result,
                    idTypeContact = domainSubscribtionContactType.idTypeContact
                 };

                var sqlCreteSubscriptionContactType = "INSERT INTO \"SubscribtionContactType\"(\"idSubscribtion\", \"idTypeContact\") VALUES (@idSubscribtion, @idTypeContact)";
                await _dbConnection.ExecuteScalarAsync<int>(sqlCreteSubscriptionContactType, modelSubscribtionContactType, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add CustomSubscribtion", ex);
            }
        }

        public async Task<bool> Update(CustomSubscribtion domain, SubscribtionContactType domainSubscribtionContactType)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);
                var model = new CustomSubscribtionModel
                {
                    id = domain.id,
                    idSubscriberType = domain.idSubscriberType,
                    idSchedule = domain.idSchedule,
                    idRepeatType = domain.idRepeatType,
                    sendEmpty = domain.sendEmpty,
                    timeStart = domain.timeStart,
                    timeEnd = domain.timeEnd,
                    monday = domain.monday,
                    tuesday = domain.tuesday,
                    wednesday = domain.wednesday,
                    thursday = domain.thursday,
                    friday = domain.friday,
                    saturday = domain.saturday,
                    sunday = domain.sunday,
                    dateOfMonth = domain.dateOfMonth,
                    weekOfMonth = domain.weekOfMonth,
                    isActive = domain.isActive,
                    idDocument = domain.idDocument,
                    activeDateStart = domain.activeDateStart,
                    activeDateEnd = domain.activeDateEnd,
                    body = domain.body,
                    title = domain.title,
                    idEmployee = domain.idEmployee,
                    idStructurePost = domain.idStructurePost
                };

                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = "UPDATE \"CustomSubscribtion\" SET \"idSubscriberType\" = @idSubscriberType, \"idSchedule\" = @idSchedule, \"idRepeatType\" = @idRepeatType, \"sendEmpty\" = @sendEmpty, \"timeStart\" = @timeStart, \"timeEnd\" = @timeEnd, \"monday\" = @monday, \"tuesday\" = @tuesday, \"wednesday\" = @wednesday, \"thursday\" = @thursday, \"friday\" = @friday, \"saturday\" = @saturday, \"sunday\" = @sunday, \"dateOfMonth\" = @dateOfMonth, \"weekOfMonth\" = @weekOfMonth, \"isActive\" = @isActive, \"idDocument\" = @idDocument, \"activeDateStart\" = @activeDateStart, \"activeDateEnd\" = @activeDateEnd, \"body\" = @body, \"title\" = @title, \"idEmployee\" = @idEmployee, \"updated_at\" = @updated_at, \"updated_by\" = @updated_by,  \"idStructurePost\" = @idStructurePost WHERE id = @id";

                var setUpdate = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);


                var modelSubscribtionContactType = new SubscribtionContactTypeModel
                {
                    idSubscribtion = domain.id,
                    idTypeContact = domainSubscribtionContactType.idTypeContact
                };

                var sqlSubscribtionContactType = "UPDATE \"SubscribtionContactType\" SET \"idTypeContact\" = @idTypeContact WHERE \"idSubscribtion\" = @idSubscribtion";
                var setUpdateSubscribtionContactType = await _dbConnection.ExecuteAsync(sqlSubscribtionContactType, modelSubscribtionContactType, transaction: _dbTransaction);

                if (setUpdate == null) return false;
                if (setUpdateSubscribtionContactType == null) return false;
                return true;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update CustomSubscribtion", ex);
            }
        }
    }
}
