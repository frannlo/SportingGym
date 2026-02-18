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

        // GET: api/TiposMembresia
        [HttpGet]
        public async Task<ActionResult<List<TipoMembresiaResponseDto>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        // GET: api/TiposMembresia/5 (Necesario para que el CreatedAtAction funcione bien)
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoMembresiaResponseDto>> GetById(int id)
        {
            var plan = await _service.GetByIdAsync(id);
            if (plan == null) return NotFound();
            return Ok(plan);
        }

        // POST: api/TiposMembresia
        [HttpPost]
        public async Task<ActionResult<TipoMembresiaResponseDto>> Create(TipoMembresiaCreateDto dto)
        {
            try
            {
                var nuevo = await _service.CreateAsync(dto);
                // Ahora sí apuntamos a GetById
                return CreatedAtAction(nameof(GetById), new { id = nuevo.Id }, nuevo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/TiposMembresia/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TipoMembresiaCreateDto dto)
        {
            var actualizado = await _service.UpdateAsync(id, dto);
            if (!actualizado) return NotFound("El plan no existe.");

            return NoContent(); // 204: Todo salió bien, no devuelvo contenido
        }

        // DELETE: api/TiposMembresia/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _service.DeleteAsync(id);
            if (!eliminado) return NotFound("El plan no existe.");

            return NoContent();
        }
    }
}