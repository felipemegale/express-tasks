import * as multer from 'multer';
import { MAX_AVATAR_FILE_SIZE } from '../../utils/constants';

export default multer({
    limits: {
        fileSize: MAX_AVATAR_FILE_SIZE,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(undefined, false);
        }
        cb(undefined, true);
    },
});
