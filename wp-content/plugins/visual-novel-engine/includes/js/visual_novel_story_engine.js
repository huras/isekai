
var script = VNE.scene_nodes ?? [];
var starting_event = window.start_event_index ?? 0;
var defaultTimeDelay = window.default_time_delay ?? 50;
var engine = undefined;

class VisualNovelEngine {
    constructor(script) {
        this.textDelay = defaultTimeDelay;        
        this.script = script;
        this.characters = [];
        this.currentIndex = 0;
        this.currentEventIndex = 0;
        this.backgroundElement = document.querySelector('.background');
        this.charactersElement = document.querySelector('.characters');
        this.dialogWindow = document.querySelector('.dialog-window');

        jQuery(this.dialogWindow).hide();

        for(var i = 0; i <= starting_event; i++) {
            this.jumpToMessageEnd = true;
            this.showNextMessage();
        }
        // Start the visual novel

        this.jumpToMessageEnd = false;
    }

    showNextMessage() {
        if (this.currentIndex < this.script.length) {
            const scriptItem = this.script[this.currentIndex];
            this.processScriptItem(scriptItem);
            this.currentIndex++;

            jQuery('.page-number').html(this.currentIndex);
            jQuery('.total-pages').html(this.script.length);

            if (['set_background', 'define_character'].includes(scriptItem.action)) {
                this.showNextMessage();
            }
        }
    }

    async processScriptItem(item) {
        jQuery(this.dialogWindow).hide();

        switch(item.node_type){
            case "set_background":
                this.backgroundElement.style.backgroundImage = `url(${item.url})`;
                break;
            case "show_narration":
                jQuery(this.dialogWindow).show();
                jQuery(this.dialogWindow).find('.speaker').hide();
                jQuery(this.dialogWindow).find('.text').html('');

                await this.animateText(item.text);

                this.textDelay = defaultTimeDelay;
                this.jumpToMessageEnd = false;
                this.is_animating = false;
                break;
            case "define_actor":
                
                const newCharacter = {
                    slug: item.slug,
                    ...item
                };
                delete newCharacter.action;
                this.characters.push(newCharacter);

                break;
        }

        if(['set_background', ''].includes(item.node_type)) {
            setTimeout(() => {
                engine.showNextMessage();
            }, 30);
        }

        if (item.action === 'define_character') {
            const characterImg = document.createElement('img');
            characterImg.src = item.src;
            characterImg.dataset.slug = item.slug;
            this.charactersElement.appendChild(characterImg);
            jQuery(characterImg).hide().attr('data-character_name', item.slug);
            
            const newCharacter = {
                slug: item.slug,
                ...item
            };
            delete newCharacter.action;
            this.characters.push(newCharacter);
        } else if (item.message) {
            jQuery(this.dialogWindow).show();
            jQuery(this.dialogWindow).find('.text').html('');
            jQuery(this.dialogWindow).find('.name').html('');
            if (item.speaker && ['narrator', undefined].includes(item.speaker) === false ) {
                const character = this.characters.find(character => character.slug === item.speaker);
                jQuery(this.dialogWindow).find('.speaker').show();
                jQuery(this.dialogWindow).find('.name').html(`${item.override_speaker_name ?? (character && character.name) ?? item.speaker}`);
            } else {
                jQuery(this.dialogWindow).find('.speaker').hide();
                jQuery(this.dialogWindow).find('.name').html('');
            }

            if(item.options && item.options.clean_flashed_characters) {
                jQuery('.flashed_images').hide().removeClass('flashed_images');
            }

            if (item.unflash_character){
                if (Array.isArray(item.unflash_character)) {
                    item.unflash_character.forEach(character => {
                        const characterImg = this.charactersElement.querySelector(`img[data-slug="${character.slug}"]`);
                        if (characterImg) {
                            jQuery(characterImg).hide().removeClass('flashed_images');
                        }
                    });
                } else {
                    const characterImg = this.charactersElement.querySelector(`img[data-slug="${item.unflash_character.slug}"]`);
                    if (characterImg) {
                        jQuery(characterImg).hide().removeClass('flashed_images');
                    }
                }
            }

            if (item.flash_character) {
                if (Array.isArray(item.flash_character)) {
                    item.flash_character.forEach(character => {
                        const characterImg = this.charactersElement.querySelector(`img[data-slug="${character.slug}"]`);
                        if (characterImg) {
                            jQuery(characterImg).show().addClass('flashed_images');
                            // if (character.position) {
                            //     jQuery(characterImg).css('left', character.position);
                            // }
                        }
                    });
                } else {
                    const characterImg = this.charactersElement.querySelector(`img[data-slug="${item.flash_character.slug}"]`);
                    if (characterImg) {
                        jQuery(characterImg).show().addClass('flashed_images');
                        // if (item.flash_character.position) {
                        //     jQuery(characterImg).css('left', item.flash_character.position);
                        // }
                    }
                }
            }
            
            this.setMugShot(item.speaker);
            await this.animateText(item.message);

            this.textDelay = defaultTimeDelay;
            this.jumpToMessageEnd = false;
            this.is_animating = false;


            // if (Array.isArray(item.message)) {
            //     item.message.forEach(line => {
            //         const lineId = Math.random().toString(36).substring(7);
            //         jQuery(this.dialogWindow).find('.text').append(`<p>${line}</p>`);
            //     });
            // } else {
            //     jQuery(this.dialogWindow).find('.text').append(`<p>${item.message}</p>`);
            // }

           
        }
    }

    setMugShot(slug) {
        const character = this.characters.find(character => character.slug === slug);
        if (!slug) { 
            jQuery('.mugshot-placeholder').hide();
        } else {
            // if(slug == 'soldier_1') debugger
            if (character) {
                jQuery('.mugshot-placeholder').show();
                jQuery('.mugshot-placeholder .mugshot').css('background-image', `url('${character.src}')`);

                if (character.face_point) {
                    // face_point: {
                    //     x: 49,
                    //     y: 12,
                    //     scale: 0.4
                    // }

                    jQuery('.mugshot-placeholder').find('.mugshot').css('background-position', `${character.face_point.x}% ${character.face_point.y}%`);
                    if (character.face_point.scale) {
                        const scale = character.face_point.scale;
                        const size = (1/scale) * 100;
                        jQuery('.mugshot-placeholder').find('.mugshot').css('width', `${size}px`);
                        jQuery('.mugshot-placeholder').find('.mugshot').css('height', `${size}px`);
                        jQuery('.mugshot-placeholder').find('.mugshot').css('transform', `scale(${scale})`);
                        jQuery('.mugshot-placeholder').find('.mugshot').css('transform-origin', '0% 100%');

                    }
                }                
            } else {
                jQuery('.mugshot-placeholder').hide();
            }
        }
    }

    async animateText(messages) {
        var text = messages;
        if (Array.isArray(messages)) {
            text = messages.join('\n');
        } else {
            messages = [messages];
        }

        this.is_animating =  true;
        const textElement = jQuery(this.dialogWindow).find('.text');

        return new Promise((resolve) => {
            let currentIndex = 0;
            const animate = () => {
                if (currentIndex < text.length || this.finishe_message) {
                    if (text[currentIndex] == '\n') {
                        textElement.append('<br>');
                    } else {
                        textElement.append(text[currentIndex]);
                    }
                    currentIndex++;

                    if (this.jumpToMessageEnd) {
                        textElement.html(messages.join('<br>'));
                        resolve();
                    } else {
                        setTimeout(animate, this.textDelay);
                    }
                } else {
                    // Animation completed
                    resolve();
                }
            };

            animate();
        });
    }

    finishMessage(){
        this.textDelay = 5;
        this.jumpToMessageEnd = true;
    }
}

// Initialize the visual novel engine
jQuery( document ).ready(() => {
    engine = new VisualNovelEngine(script);
    script = window.script ?? [];
    starting_event = window.start_event_index ?? 0;
    defaultTimeDelay = window.default_time_delay ?? 50;
});

// Handle user input to progress through the story
document.addEventListener('click', () => {
    if(engine){
        if(!engine.is_animating) {
            engine.showNextMessage();
        } else {
            engine.finishMessage();
        }
    } else {
        console.error("No Engine")
    }
});