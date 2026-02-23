# 1. Usar la imagen de .NET SDK para compilar el código
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar todo el código fuente
COPY . ./

# Restaurar dependencias y publicar una versión optimizada
RUN dotnet publish -c Release -o out

# 2. Usar una imagen más ligera solo para ejecutar la app (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "SportingGym.dll"]