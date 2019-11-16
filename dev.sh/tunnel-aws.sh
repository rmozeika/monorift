# node server
ssh -N -L 8080:localhost:8080 ec2-3-17-13-33.us-east-2.compute.amazonaws.com

#nginx
ssh -N -L 80:localhost:80 ec2-3-17-13-33.us-east-2.compute.amazonaws.com

#mongo 
ssh -N -L 27017:localhost:27017 ec2-3-17-13-33.us-east-2.compute.amazonaws.com
