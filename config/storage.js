import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter(req, file, cb) {
        const allowedExtensions = [
            "wav", "mp3", "aac", "m4a", "flac", "ogg", "wma", "alac", "aiff", "amr", "opus", "mid", "midi", "dsd", "dff",
            "jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "svg", "ico", "heic", "avif", "jp2", "jxr", "pbm", "pgm", "ppm",
            "mp4", "webm", "avi", "mov", "mkv"
        ];


        if (file.fieldname === "attachments") {
            const extension = file.originalname.split(".").pop().toLowerCase();

            if (!allowedExtensions.includes(extension)) {
                return cb(new Error("Unsupported file format"));
            }
        }

        cb(null, true);
    },
});

export default upload;
