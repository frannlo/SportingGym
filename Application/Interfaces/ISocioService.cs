using SportingGym.Application.DTOs;
using SportingGym.WebApi.Application.DTOs;

namespace SportingGym.WebApi.Application.Interfaces
{
    public interface ISocioService
    {
        Task<List<SocioResponseDto>> GetAllAsync();
        Task<SocioResponseDto?> GetByIdAsync(int id);
        Task<SocioResponseDto> CreateAsync(SocioCreateDto socioDto);
        Task<bool> UpdateAsync(int id, SocioCreateDto socioDto);
        Task<bool> DeleteAsync(int id); // Baja lógica
    }
}