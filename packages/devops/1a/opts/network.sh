
NAME="monorift"
VM="vm-instance-2"
REGION="us-central1"
OLDNAME="External\ NAT"
#name=$1
function networkGroup () {
    gcloud compute instances delete-access-config $NAME --access-config-name OLDNAME
    gcloud compute instances add-access-config $VM --access-config-name $NAME --address 34.102.129.166
    gcloud compute addresses describe $NAME --us-central1
    echo "NEW ADDRESSES\n\n"
    gcloud compute addresses list
}

