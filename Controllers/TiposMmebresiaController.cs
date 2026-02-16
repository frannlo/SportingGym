using Microsoft.AspNetCore.Mvc;
using SportingGym.WebApi.Application.DTOs;
using SportingGym.WebApi.Application.Interfaces;

namespace SportingGym.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TiposMembresiaController : ControllerBase
    {
        private readonly ITipoMembresiaService _service;

        public TiposMembresiaController(ITipoMembresiaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<TipoMembresiaResponseDto>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpPost]
        public async Task<ActionResult<TipoMembresiaResponseDto>> Create(TipoMembresiaCreateDto dto)
        {
            var nuevo = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = nuevo.Id }, nuevo);
        }

        // Puedes agregar PUT y DELETE siguiendo el ejemplo de Socios si quieres el CRUD completo
    }
}
namespace SportingGym.Controllers
{
    public class TiposMmebresiaController
    {
    }
}
