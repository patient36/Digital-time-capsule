const createFile = async (file, fileModel, chunksModel, userId, chunkSize = 250000) => {
  try {
    // File
    const newFile = new fileModel({
      filename: file.originalname,
      contentType: file.mimetype,
      length: file.size,
      chunkSize: chunkSize,
      owner: userId
    });
    await newFile.save();

    // Chunks
    const chunks = Math.ceil(file.size / chunkSize);
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.buffer.slice(start, end);

      const chunkDoc = new chunksModel({
        files_id: newFile._id,
        n: i,
        data: chunk,
      });

      await chunkDoc.save();
    }

    // Return the file ID after saving the file and chunks
    return newFile._id;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create file and chunks");
  }
};

export default createFile;
