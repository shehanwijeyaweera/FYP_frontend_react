import React, { Component } from 'react'

export default class FooterComponent extends Component {
    render() {
        return (
            <div>
                <footer className="footer" style={{position:"absolute",left:0,bottom:0,right:0}}>
                    <span className="text-muted">All Rights Reserved 2021</span>
                </footer>
            </div>
        )
    }
}
