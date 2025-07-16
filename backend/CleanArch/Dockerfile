FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build

COPY . /source

WORKDIR /source/WebApi

ARG TARGETARCH

RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet publish -a ${TARGETARCH/amd64/x64} --use-current-runtime --self-contained false -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
ENV TZ=Asia/Bishkek

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
RUN apk add --no-cache icu-libs

RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime
WORKDIR /app

COPY --from=build /app .

USER root

ENTRYPOINT ["dotnet", "WebApi.dll"]
