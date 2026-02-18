using SportingGym.WebApi.Application.DTOs;

namespace SportingGym.WebApi.Application.Interfaces
{
    public interface IPagoService
    {
        Task<PagoResponseDto> RegistrarPagoAsync(PagoCreateDto dto);
        Task<List<PagoResponseDto>> GetBySocioIdAsync(int socioId);
        Task<List<PagoResponseDto>> GetAllAsync();
    }
}