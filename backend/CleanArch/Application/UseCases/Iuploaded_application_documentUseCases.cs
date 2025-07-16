using Domain.Entities;
using FluentResults;

namespace Application.UseCases;

public interface Iuploaded_application_documentUseCases
{
    Task<Result<uploaded_application_document>> Create(uploaded_application_document domain);
}