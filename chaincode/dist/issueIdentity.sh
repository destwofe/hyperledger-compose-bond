composer identity issue -c admin@bond -f cards/$1.card -u $1 -a "resource:org.tbma.Account#$1";
composer card import -f cards/$1.card;
