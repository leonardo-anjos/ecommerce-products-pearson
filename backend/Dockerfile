# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["EcommerceProducts/EcommerceProducts.csproj", "EcommerceProducts/"]
RUN dotnet restore "EcommerceProducts/EcommerceProducts.csproj"

COPY . .
RUN dotnet build "EcommerceProducts/EcommerceProducts.csproj" -c Release -o /app/build

RUN dotnet publish "EcommerceProducts/EcommerceProducts.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .
COPY entrypoint.sh /app/

RUN chmod +x /app/entrypoint.sh

EXPOSE 5079

ENV ASPNETCORE_URLS=http://+:5079
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["/app/entrypoint.sh"]

