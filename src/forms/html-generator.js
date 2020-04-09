'use stict'

module.exports = class HTMLBuilder{
    constructor(){
        this.html = `
            <!DOCTYPE html>
            <html>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            `

    }

    createHead(title, links, script){
        var head = '<head>' 
        this.html += head;
    }

    finish_save(){
        this.html += '</html>'
        console.log(this.html);
    }
}