namespace Azure.BlobStorage.Server.Services
{
    public interface IBlobStorage
    {
        public Task<List<string>> GetAllFiles(string connectionString, string containerName);
        Task UploadFiles(string connectionString, string containerName, string fileName, Stream fileContent);
        Task<Stream> GetFiles(string connectionString, string containerName, string fileName);
        Task<bool> DeleteFiles(string connectionString, string containerName, string fileName);
    }
}
