using Microsoft.AspNetCore.Mvc;
using SportingGym.WebApi.Application.DTOs;
using SportingGym.WebApi.Application.Interfaces;

namespace SportingGym.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagosController : ControllerBase
    {
        private readonly IPagoService _service;

        public PagosController(IPagoService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<PagoResponseDto>> Registrar(PagoCreateDto dto)
        {
            try
            {
                var pago = await _service.RegistrarPagoAsync(dto);
                return Ok(pago);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<PagoResponseDto>>> GetAll()
        {
            var pagos = await _service.GetAllAsync();
            return Ok(pagos);
        }

        [HttpGet("socio/{socioId}")]
        public async Task<ActionResult<List<PagoResponseDto>>> GetPorSocio(int socioId)
        {
            return Ok(await _service.GetBySocioIdAsync(socioId));
        }
    }
}