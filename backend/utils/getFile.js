const getFile = async (id, fileModel, chunksModel, userId, res, req, next) => {
  try {
    const file = await fileModel.findOne({ _id: id, owner: userId });

    if (!file) {
      console.log("File not found.");
      return res.status(404).send("File not found.");
    }

    const start = 0;
    const end = file.length - 1;
    const contentLength = end - start + 1;

    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Content-Length", contentLength);
    res.setHeader("Content-Range", `bytes ${start}-${end}/${file.length}`);
    res.status(206); // Partial content status

    // Create the chunk stream
    const chunkStream = chunksModel.find({ files_id: id }).sort({ n: 1 }).cursor();

    // Add client disconnection handling
    let clientDisconnected = false;
    req.on("close", () => {
      console.log("Client disconnected.");
      clientDisconnected = true;
      chunkStream.close(); // Stop fetching further chunks
    });

    // Stream the chunks to the client
    let streamedLength = 0;
    for (
      let chunkDoc = await chunkStream.next();
      chunkDoc != null && streamedLength < contentLength;
      chunkDoc = await chunkStream.next()
    ) {
      // Stop processing if the client has disconnected
      if (clientDisconnected) {
        console.log("Aborting streaming due to disconnection.");
        return;
      }

      const chunkStartIndex = streamedLength;
      const chunkEndIndex = streamedLength + chunkDoc.data.length - 1;

      if (chunkEndIndex >= start && chunkStartIndex <= end) {
        const sliceStart = Math.max(0, start - chunkStartIndex);
        const sliceEnd = Math.min(chunkDoc.data.length, end - chunkStartIndex + 1);
        const chunkData = chunkDoc.data.slice(sliceStart, sliceEnd);

        res.write(chunkData);
      }

      streamedLength += chunkDoc.data.length;
    }

    res.end();
    console.log("Streaming complete.");
  } catch (error) {
    next(error)
  }
};

export default getFile;
