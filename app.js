const axios = require('axios');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const url = 'https://dadosabertos.rfb.gov.br/CNPJ/';

axios.get(url).then(response => {
    const nowtime = new Date();
    const links = response.data.match(/href="(.*?)"/g);
    const zipLinks = links.filter(link => link.includes('.zip'));

    zipLinks.forEach(link => {
        const linkText = link.match(/href="(.*?)"/)[1];
        const file = fs.createWriteStream(`./temp/${linkText}`);
        axios.get(`${url}${linkText}`, { responseType: 'stream' }).then(response => {
            response.data.pipe(file);
            file.on('finish', () => {
                file.close();
                const zip = new AdmZip(`./temp/${linkText}`);
                zip.extractAllTo(`./temp`, true);
            });
        });
        console.log('Baixado e extraido' + linkText);
});
    const endtime = new Date();
    console.log('Tempo total: ' + (endtime - nowtime) / 1000 + 's');
});
