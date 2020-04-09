# # node server
# ssh -N -L 8080:localhost:8080 ec2-3-17-13-33.us-east-2.compute.amazonaws.com

# #nginx
# ssh -N -L 80:localhost:80 ec2-3-17-13-33.us-east-2.compute.amazonaws.com

# #mongo 
# ssh -N -L 27017:localhost:27017 ec2-3-17-13-33.us-east-2.compute.amazonaws.com


ssh -N -L 27018:localhost:27018 aws
ssh -N -L 5433:localhost:5433 aws
ssh -N -L 6379:localhost:6380 aws

