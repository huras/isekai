
        window.script = [
            {
                action: "set_background",
                src: "http://isekai.hurast.com/wp-content/uploads/visual_novel_backgrounds/00041-2534950232.png",
                slug: "woods1",
                name: "Some Unknown Forest"
            },
            {
                action: "define_character",
                name: "Mimada",
                slug: "mimada",
                src: "http://isekai.hurast.com/wp-content/uploads/visual_novel_characters/00074-3702991810.png",
                face_point: {
                    x: 49,
                    y: 18,
                    scale: 0.5
                }
            },
            {
                action: "define_character",
                name: "Soldier 1",
                slug: "soldier_1",
                src: "http://isekai.hurast.com/wp-content/uploads/visual_novel_characters/00082-2019921360.png",
                face_point: {
                    x: 49,
                    y: 12,
                    scale: 0.4
                }
            },
            {
                action: "define_character",
                name: "Soldier 2",
                slug: "soldier_2",
                src: "http://isekai.hurast.com/wp-content/uploads/visual_novel_characters/00149-887275055.png",
                face_point: {
                    x: 57,
                    y: 15,
                    scale: 0.4
                }
            },
            {
                message: [
                    "I wake up with my head tingling and formigamento in the whole body.",
                ],
            },
            {
                message: [
                    "I try to get up.",
                ],
            },
            {
                message: [
                    "OUCH!",
                ],
                speaker: "You",
            },
            {
                message: [
                    "My whole body hurts...",
                ],
            },
            {
                message: [
                    "I realize I'm on top of a tree.",
                    "In a very weird position...",
                ],
            },
            {
                message: [
                    "I'm glad nobody is seeing me like this.",
                ],
                speaker: "You",
            },
            {
                message: ["Hey!", "Everyone there is an ugly girl spying on us!"],
                speaker: "mimada",
                override_speaker_name: "Girl",
                flash_character: {
                    slug: "mimada",
                    position: "center"
                }
            },
            {
                message: ["Up there!"],
                speaker: "mimada",
                override_speaker_name: "Girl",
                flash_character: {
                    slug: "mimada",
                    position: "center"
                },
            },
            {
                message: [
                    "What?",
                    "Who said that?",
                ],
                speaker: "You",
            },
            {
                message: [
                    "I'm not a girl",
                ],
                speaker: "You",
            },
            {
                message: [
                    "Yes your majesty!",
                ],
                speaker: "soldier_1",
                flash_character: {
                    slug: "soldier_1",
                    position: "right"
                }
            },
            {
                message: [
                    "I look down and see a little girl and a woman."
                ],
                flash_character: [{
                    slug: "soldier_1",
                    position: "right"
                },
                {
                    slug: "mimada",
                    position: "center"
                }]
            },            
            {
                message: [
                    "I'll get she right away!"
                ],
                speaker: "soldier_1",
                flash_character: {
                    slug: "soldier_1",
                    position: "right"
                }
            },
            {
                message: [
                    "I already said I'm NOT a..",
                ],
                speaker: "You",
            },
            {
                message: [
                    "The woman wearing a green bikini armor with purple panties starts to climb the tree.",
                ],
                unflash_character: {
                    slug: "mimada",
                }
            },
            {
                message: [
                    "Get me?",
                ],
                speaker: "You",
            },
            {
                message: [
                    "For what?",
                ],
                speaker: "You",
            },
            {
                message: [
                    "I don't like this!",
                    "I'm getting out of here!"
                ],
                speaker: "You",
            },
            {
                message: [
                    "You are not going anywhere!",
                ],
                speaker: "soldier_2",
                options: {
                    clean_flashed_characters: true
                }
            },
            {
                message: [
                    "Who-",
                ],
                speaker: "You",
            },
            {
                message: [
                    "Before I could finish my question, I was hit with a kick in the back.",
                ],
                flash_character: {
                    slug: "soldier_2",
                    position: "right"
                }
            },
            {
                message: [
                    "THUD!",
                ],
            },
            {
                message: [
                    "I fell from the tree.",
                    "With the back on the floor.",
                ],
            },
            {
                action: "set_background",
                src: "imgs/vntest/backgrounds/00242-1899305028.png",
                slug: "woods1",
                name: "Some Unknown Forest 2"
            },
        ];
        window.start_event_index = 0;
        window.default_time_delay = 15;
    