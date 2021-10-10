import React, {Component} from 'react'

import errorImage from '../../assets/images/empty_box.png'

class Error500 extends Component {
    render() {
        return(
            <React.Fragment>
                <div className="w-full mb-4">
                    <img src={errorImage} alt="broken_robot" width="150px" className="block text-center m-auto" />
                </div>

                <div className="w-6/12 m-auto">
                    <p className="text-center text-4xl mb-0 text-green-500">
                        Oops!!
                    </p>

                    <p className="text-sm text-center mb-2 text-gray-600">
                        Something went horribly wrong.
                    </p>

                    <p className="text-sm text-center form-group mb-0 text-gray-600">
                        Try reloading the page. If error persists contact system administrator.
                    </p>
                </div>
            </React.Fragment>
        )
    }
}

export default Error500