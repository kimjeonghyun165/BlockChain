import React, {Component} from 'react'


class Dao extends Component {
    render() {
        return (
            <div id='contentvote' className='mt-3'>
                <form style={{display : 'grid', margin : '30em'}}>
                    <label className='float-left' style={{marginLeft:'15px'}}>
                        <b>
                            Title
                        </b>
                    </label>
                    <input className='title' placeholder='title'>
                    </input>
                    <label className='float-left' style={{marginLeft:'15px', marginTop:'2em'}}>
                        <b>
                            Description
                        </b>
                    </label>
                    <input className='description' placeholder='Description'>
                    </input>
                </form>
            </div>
        )
    }
}

export default Dao;