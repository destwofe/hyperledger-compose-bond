# Bond

## System ACL
|Asset/Action|READ           |CREATE         |UPDATE         |
|------------|---------------|---------------|---------------|
|Account     |Owner          |Admin          |None           |
|Bond        |All            |Issuer         |None           |
|BondWallet  |Owner, Issuer  |Investor       |All(tx)        |
|MoneyWallet |Owner          |All            |Gatway(tx)     |

----

## Transaction
|Asset       | Action        |Participant    |
|------------|---------------|---------------|
|Money       |Deposit        |Gateway        |
|Money       |Withdraw       |Gateway        |
|Money       |Transfer       |All            |
|Bond        |Transfer       |Investor       |
|Bond        |Purchase       |Investor       |
|Bond        |Coupon Payout  |Issuer         |
|Bond        |Buy Back       |Issuer         |
|Account Role|Grant/Revoke   |Admin          |
