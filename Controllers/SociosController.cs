using Microsoft.AspNetCore.Mvc;
using SportingGym.Application.DTOs;
using SportingGym.WebApi.Application.DTOs;
using SportingGym.WebApi.Application.Interfaces;

namespace SportingGym.Controllers
{
    [Route("api/[controller]")] // Ruta base para el controlador
    [ApiController] // Indica que este controlador es una API
    public class SociosController : ControllerBase
    {
        private readonly ISocioService _socioService;

        //Contructor para inyectar el servicio de socios que se ha registrado en Program.cs
        public SociosController(ISocioService socioService)
        {
            _socioService = socioService;
        }

        //GET: api/socios
        [HttpGet]
        public async Task<ActionResult<List<SocioResponseDto>>> GetAll()
        {
            var socios = await _socioService.GetAllAsync();
            return Ok(socios);
        }

        //GET: api/socios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SocioResponseDto>> GetById(int id)
        {
            var socio = await _socioService.GetByIdAsync(id);
            if (socio == null)
            {
                return NotFound("Socio no encontrado brooo");
            }
            return Ok(socio);

        }
        //POST: api/socios
        [HttpPost]
        public async Task<ActionResult<SocioResponseDto>> Create(SocioCreateDto socioDto)
        {
            try
            {
                var nuevoSocio = await _socioService.CreateAsync(socioDto);
                // Devuelve un 201 Created y la url donde consultar el nuevo recurso
                return CreatedAtAction(nameof(GetById), new { id = nuevoSocio.Id }, nuevoSocio);
            }
            catch (Exception ex)
            {
                // Aquí capturamos la excepción de "DNI duplicado" que pusimos en el servicio
                return BadRequest(ex.Message);
            }
        }
        // PUT: api/socios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SocioCreateDto socioDto)
        {
            var actualizado = await _socioService.UpdateAsync(id, socioDto);
            if (!actualizado) return NotFound("Socio no encontrado.");

            return NoContent(); // 204 No Content es el estándar para updates exitosos
        }

        // DELETE: api/socios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _socioService.DeleteAsync(id);
            if (!eliminado) return NotFound("Socio no encontrado.");

            return NoContent();
        }
    }
}
