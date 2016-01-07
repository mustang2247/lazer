import File, * as FILE from 'loader/File.js';

export default function ImageFile (key, url = '', data = undefined) {

    if (url === '' && !data)
    {
        url = key + '.png';
    }

    let file = File(key, url, 'image');

    file.load = function () {

        this.onStateChange(FILE.LOADING);

        this.data = new Image();

        if (this.crossOrigin)
        {
            this.data.crossOrigin = this.crossOrigin;
        }

        return new Promise(
            (resolve, reject) => {

                this.data.onload = () => {
                    if (this.data.onload)
                    {
                        this.data.onload = null;
                        this.data.onerror = null;
                        this.onStateChange(FILE.LOADED);
                        resolve(file);
                    }
                };

                this.data.onerror = (event) => {
                    if (this.data.onload)
                    {
                        this.data.onload = null;
                        this.data.onerror = null;
                        this.onStateChange(FILE.FAILED);
                        reject(file, event);
                    }
                };

                this.data.src = this.src;

                // Image is immediately-available or cached

                if (this.data.complete && this.data.width && this.data.height)
                {
                    this.data.onload = null;
                    this.data.onerror = null;
                    this.onStateChange(FILE.COMPLETE);
                    resolve(file);
                }

            }
        );

    };

    return file;

}
