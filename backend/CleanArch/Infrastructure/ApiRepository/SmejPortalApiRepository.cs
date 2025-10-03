using Application.Repositories;
using DocumentFormat.OpenXml.Presentation;
using Domain.Entities;
using FluentResults;
using Flurl;
using Flurl.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Threading.Tasks;
using static Application.UseCases.ApplicationUseCases;

namespace Infrastructure.Repositories
{
    public class SmejPortalApiRepository : ISmejPortalApiRepository
    {
        private readonly string _apiSmejPortal;
        private readonly string _ClientId;
        private readonly string _ClientSecret;


        public SmejPortalApiRepository(IConfiguration configuration)
        {
            _apiSmejPortal = configuration.GetValue<string>("ExternalApi:SmejPortal") ??
                             throw new ArgumentNullException(nameof(configuration), "API SmejPortal not configured");
        }

        public async Task<Result<List<SmejPortalOrganization>>> GetAllOrganizationData()
        {
            try
            {
                var response = await _apiSmejPortal
                    .AppendPathSegment("Organization")
                    .AppendPathSegment("GetAll")
                    .GetStringAsync();

                var document = JsonConvert.DeserializeObject<List<SmejPortalOrganization>>(response);
                return Result.Ok(document);
            }
            catch (Exception ex)
            {
                return Result.Fail(new Error("Failed to send application data")
                    .WithMetadata("ErrorCode", "EXTERNAL_API_ERROR")
                    .WithMetadata("Details", ex.Message));
            }
        }
        
        public async Task<Result<List<SmejPortalApprovalRequest>>> GetByApplicationNumberApprovalRequestData(string number)
        {
            try
            {
                var response = await _apiSmejPortal
                    .AppendPathSegment("ApprovalRequest")
                    .AppendPathSegment("GetByApplicationNumber")
                    .SetQueryParam("number", number)
                    .GetStringAsync();

                var document = JsonConvert.DeserializeObject<List<SmejPortalApprovalRequest>>(response);
                return Result.Ok(document);
            }
            catch (Exception ex)
            {
                return Result.Fail(new Error("Failed to send application data")
                    .WithMetadata("ErrorCode", "EXTERNAL_API_ERROR")
                    .WithMetadata("Details", ex.Message));
            }
        }
    }
}