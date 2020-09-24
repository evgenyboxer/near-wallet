import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import AmountInput from './AmountInput'
import ValidatorBox from './ValidatorBox'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import ArrowCircleIcon from '../../svg/ArrowCircleIcon'
import TransferMoneyIcon from '../../svg/TransferMoneyIcon'
import { stake } from '../../../actions/staking'
import StakeConfirmModal from './StakeConfirmModal'

export default function Stake({ match, validators, formLoader, actionsPending, handleGetValidators }) {
    const dispatch = useDispatch()
    const [confirm, setConfirm] = useState();
    const [amount, setAmount] = useState('');
    const [success, setSuccess] = useState();
    const validator = validators.filter(validator => validator.name === match.params.validator)[0]

    const handleStake = async () => {
        await dispatch(stake(validator.name, amount))
        await handleGetValidators()
        setSuccess(true)
        setConfirm(false)
    }
    
    if (!success) {
        return (
            <>
                <h1><Translate id='staking.stake.title' /></h1>
                <h2><Translate id='staking.stake.desc' /></h2>
                <h4><Translate id='staking.stake.amount' /></h4>
                <AmountInput value={amount} onChange={setAmount}/>
                <ArrowCircleIcon/>
                <h4><Translate id='staking.stake.stakeWith' /></h4>
                {validator && 
                    <ValidatorBox
                        validator={validator.name}
                        fee={validator.fee.percentage}
                        clickable={false}
                    />
                }
                <FormButton
                    disabled={formLoader || !amount.length} 
                    sending={actionsPending.includes('STAKE')} 
                    onClick={() => setConfirm(true)}
                >
                    <Translate id='staking.stake.button' />
                </FormButton>
                {confirm &&
                    <StakeConfirmModal
                        validatorName={validator.name} 
                        amount={amount}
                        open={confirm} 
                        onConfirm={handleStake} 
                        onClose={() => setConfirm(false)}
                        loading={formLoader || actionsPending.some(action => ['STAKE', 'GET_VALIDATORS'].includes(action))}
                    />
                }
            </>
        )
    } else {
        return (
            <>
                <TransferMoneyIcon/>
                <h1><Translate id='staking.stakeSuccess.title' /></h1>
                <h4 style={{ textAlign: 'center' }} ><Translate id='staking.stakeSuccess.desc' /></h4>
                {validator.stakedBalance && 
                    <ValidatorBox
                        validator={validator.name}
                        fee={validator.fee.percentage}
                        amount={validator.stakedBalance}
                        clickable={false}
                        style={{margin: '40px 0'}}
                    />
                }
                <h4 style={{ textAlign: 'center' }}><Translate id='staking.stakeSuccess.descTwo' /></h4>
                <FormButton linkTo='/staking' className='seafoam-blue'><Translate id='staking.stakeSuccess.button' /></FormButton>
            </>
        )
    }
}