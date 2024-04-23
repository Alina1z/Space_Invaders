const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// Creating Player class and its properties.
class Player {
    constructor() {
        this.position = {
            x: canvas.width / 2 - this.width / 2, 
            y: 200
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0

        const image = new Image()
        image.src = './images/spaceship.png'
        //above (spaceship.png) is a placeholder until we get ahold of graphics team.
        image.onload = () => {
            const ratio = 0.15 //scale for img
            this.image = image
            this.width = image.width * ratio
            this.height = image.height * ratio
            this.position = {
                x: canvas.width / 2 - this.width / 2, 
                y: canvas.height - this.height - 20
            } 
        }
    }
    
    draw(){ 

        // the red box is going to be used for debugging later - collision
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y,
        // this.width, this.height)

        c.save()
        c.translate(
            player.position.x + player.width / 2, 
            player.position.y + player.height / 2
        )
        
        c.rotate(this.rotation)

        c.translate(
            -player.position.x - player.width / 2, 
            -player.position.y - player.height / 2
        )

        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )
        c.restore()
    } //end draw function

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    } //end update function
} // end Player class

class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(
            this.position.x, 
            this.position.y, 
            this.radius,
            0, 
            Math.PI*2
        )
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    } // end draw function

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    } // end update function
} // end Projectile class

const player = new Player()
// create player
const projectiles = []
// create projectiles within array
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}
//monitors keys being pressed

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    projectiles.forEach((projectile, index) => {
        //GARBAGE COLLECTION: Remove projectiles once they are off-screen
        if (projectile.position.y + projectile.radius <= 0){
            setTimeout (() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
            //calling update function for each projectile
        }
    }) 

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.rotation = -0.15
    } else if ( 
        keys.d.pressed && 
        player.position.x + player.width <= canvas.width
    ) {
        player.velocity.x = 7
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }
} // end animate function

animate()

addEventListener("keydown", ({key}) => {
        //console.log(key)
        switch (key) {
            case 'a':
                //console.log('left')
                keys.a.pressed = true
                break
            case 'd':
                //console.log('right')
                keys.d.pressed = true
                break
            case ' ':
                //console.log('space')
                projectiles.push(new Projectile ({
                        position: {
                            x: player.position.x + player.width / 2,
                            y: player.position.y
                        },
                        velocity: {
                            x: 0,
                            y: -15
                        }
                    }))
                    //console.log(projectiles)
                break
        }
    }); 
    //keydown indicates which key is being pressed by the player.
    // a to strafe left, d to strafe right, and space for shooting projectiles.

addEventListener("keyup", ({key}) => {
        //console.log(key)
        switch (key) {
            case 'a':
                //console.log('left')
                keys.a.pressed = false
                break
            case 'd':
                //console.log('right')
                keys.d.pressed = false
                break
            case ' ':
                //console.log('space')
                break
        }
    }); 