using Microsoft.AspNetCore.Mvc;

namespace CAS.Controllers
{
    public class CASController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
        [HttpPost("/login")]
        public IActionResult LoginPost()
        {
			string token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiMjQ1MTA3IiwiaWF0IjoxNzQ5MjEwMTE3LCJleHAiOjE3NDkyMTAxNzd9.cI3PdodSWCxMNM2tZClll6QVs__KgYVlIOEN1tcdwwg";
			return Redirect($"https://localhost:7065/login?token={token}");
        }
	}
}
