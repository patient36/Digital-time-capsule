const deleteFile = async (id, fileModel, chunksModel) => {
    try {
      // Check if file exists
      const file = await fileModel.findById(id);
      if (!file) {
        console.error("File not found.");
        return;
      }
  
      // Delete associated chunks
      const chunkDeletionResult = await chunksModel.deleteMany({ files_id: id });
      if (chunkDeletionResult.deletedCount === 0) {
        console.warn("No chunks found for this file.");
      }
  
      // Delete file metadata
      const fileDeletionResult = await fileModel.deleteOne({ _id: id });
      if (fileDeletionResult.deletedCount === 0) {
        console.error("File deletion failed.");
        return;
      }
  
      console.log("File and its associated chunks deleted successfully.");
    } catch (err) {
      console.error("Error during file deletion:", err.message);
    }
  };
  
  export default deleteFile;
  