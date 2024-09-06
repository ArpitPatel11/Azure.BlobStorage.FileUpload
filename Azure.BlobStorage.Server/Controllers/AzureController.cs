using Azure.BlobStorage.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Azure.BlobStorage.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AzureController : ControllerBase
    {
        #region private fields
        private readonly IBlobStorage _storage;
        private readonly string _connectionString;
        private readonly string _container;
        #endregion

        #region constructor
        public AzureController(IBlobStorage storage, IConfiguration configuration)
        {
            _storage = storage;
            _connectionString = configuration.GetValue<string>("BlobConfiguration:StorageConnection");
            _container = configuration.GetValue<string>("BlobConfiguration:ContainerName");
        }
        #endregion

        #region AzureBlob Files
        [HttpGet("ListFiles")]
        public async Task<List<string>> ListFiles()
        {
            return await _storage.GetAllFiles(_connectionString, _container);
        }

        [Route("InsertFile")]
        [HttpPost]
        public async Task<bool> InsertFile([FromForm] IFormFile file)
        {
            if (file != null)
            {
                Stream stream = file.OpenReadStream();
                await _storage.UploadFiles(_connectionString, _container, file.FileName, stream);
                return true;
            }
            return false;
        }

        [HttpGet("DownloadFile/{fileName}")]
        public async Task<IActionResult> DownloadFile(string fileName)
        {
            var content = await _storage.GetFiles(_connectionString, _container, fileName);
            return File(content, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }

        [Route("DeleteFile/{fileName}")]
        [HttpGet]
        public async Task<bool> DeleteFile(string fileName)
        {
            return await _storage.DeleteFiles(_connectionString, _container, fileName);
        }
        #endregion
    }
}
