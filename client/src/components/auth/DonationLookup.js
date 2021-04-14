import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import DonationItem from './DonationItem';
import { getDonation, getDonations } from '../../actions/auth'

const DonationLookup = ({ getDonation, getDonations }) => {
    const [donation, setDonation] = useState();
    const [transactionId, setTransactionId] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        var currDonation = await getDonation(transactionId);
        console.log("donation is..." + currDonation);
        setDonation(currDonation);
    }

    const onIdChange = (e) => {
        setTransactionId(e.target.value);
    }

    return (
        <div>
            <Fragment>
                <h1 className="large text-primary">Lookup A Transaction</h1>
                <p className="lead">
                    <i className="fas fa-user"></i> Enter your transaction ID to view previous transaction.
                </p>
                <form className="form" onSubmit={async (e) => { await onSubmit(e) }}>
                    <div className="form-group">
                    <input
                        type="text"
                        id="transactionid"
                        maxLength="50"
                        placeholder="Enter Transaction Id Here"
                        name="transactionid"
                        minLength="6"
                        value={transactionId}
                        onChange={(e) => onIdChange(e)}
                        required
                    />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
                {/* <button className="btn btn-primary" onClick={onSubmit}>Submit</button> */}
                <br></br>
                <div className="posts">
                    {donation &&
                        <DonationItem donation={donation} />
                    }
                </div>
            </Fragment>
        </div>
    )
}

DonationLookup.propTypes = {
    getDonation: PropTypes.func.isRequired,
    getDonations: PropTypes.func.isRequired,
}

export default connect(null, { getDonation, getDonations })(DonationLookup);
