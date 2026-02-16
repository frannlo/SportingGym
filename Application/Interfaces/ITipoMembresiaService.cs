using SportingGym.WebApi.Application.DTOs;

namespace SportingGym.WebApi.Application.Interfaces
{
    public interface ITipoMembresiaService
    {
        Task<List<TipoMembresiaResponseDto>> GetAllAsync();
        Task<TipoMembresiaResponseDto?> GetByIdAsync(int id);
        Task<TipoMembresiaResponseDto> CreateAsync(TipoMembresiaCreateDto dto);
        Task<bool> UpdateAsync(int id, TipoMembresiaCreateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}