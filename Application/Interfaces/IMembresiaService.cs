using SportingGym.WebApi.Application.DTOs;

namespace SportingGym.WebApi.Application.Interfaces
{
    public interface IMembresiaService
    {
        Task<MembresiaResponseDto> CreateAsync(MembresiaCreateDto dto);
        Task<MembresiaResponseDto?> GetByIdAsync(int id);
        // Podríamos agregar un método para buscar todas las membresías de UN socio específico
        Task<List<MembresiaResponseDto>> GetBySocioIdAsync(int socioId);
    }
}