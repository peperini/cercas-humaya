import each from 'lodash/each'

import Home from 'pages/Home'
import Preloader from 'components/Preloader'
import Quoter from 'components/Quoter'

class App {
  constructor() {
    this.createPreloader()
    this.createQuoter()
    this.createContent()
    this.createPages()

    this.addEventListeners()
    this.addLinkListeners()

    this.update()
  }

  createQuoter () {
    this.quoter = new Quoter()

    this.quoter.create()
  }

  createPreloader () {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages () {
    this.pages = {
      home: new Home()
    }

    this.page = this.pages[this.template]
    this.page.create()
    this.page.show()
  }

  onPreloaded () {
    this.preloader.destroy()

    this.onResize()
  }

  async onChange (url) {
    await this.page.hide()

    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      const div = document.createElement('div')

      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template =  divContent.getAttribute('data-template')

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.page = this.pages[this.template]
      this.page.create()

      this.onResize()

      this.page.show()

      this.addLinkListeners()
    } else {
      console.log('Request Error')
    }
  }

  onResize () {
    if (this.page && this.page.onResize) {
      this.page.onResize()
    }
  }

  update () {
    if (this.page && this.page.update) {
      this.page.update()
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  addEventListeners () {
    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        event.preventDefault()

        const { href } = link

        this.onChage(href)
      }
    })
  }
}

new App()
