using Microsoft.AspNetCore.Mvc;
using SportingGym.WebApi.Application.DTOs;
using SportingGym.WebApi.Application.Interfaces;

namespace SportingGym.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembresiasController : ControllerBase
    {
        private readonly IMembresiaService _service;

        public MembresiasController(IMembresiaService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<MembresiaResponseDto>> Create(MembresiaCreateDto dto)
        {
            try
            {
                var nueva = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = nueva.Id }, nueva);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MembresiaResponseDto>> GetById(int id)
        {
            var m = await _service.GetByIdAsync(id);
            if (m == null) return NotFound();
            return Ok(m);
        }

        [HttpGet("socio/{socioId}")]
        public async Task<ActionResult<List<MembresiaResponseDto>>> GetBySocio(int socioId)
        {
            return Ok(await _service.GetBySocioIdAsync(socioId));
        }
    }
}