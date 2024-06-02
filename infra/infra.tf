provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "main-vpc"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "main-igw"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  tags = {
    Name = "public-rt"
  }
}

resource "aws_route_table_association" "public_rt_assoc_az1" {
  subnet_id      = aws_subnet.public_subnet_az1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_rt_assoc_az2" {
  subnet_id      = aws_subnet.public_subnet_az2.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_subnet" "public_subnet_az1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.0.0/20"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "sample-subnet-public01"
  }
}

resource "aws_subnet" "private_subnet_az1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.64.0/20"
  availability_zone = "ap-northeast-1a"
  tags = {
    Name = "sample-subnet-private01"
  }
}

resource "aws_subnet" "public_subnet_az2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.16.0/20"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = true
  tags = {
    Name = "sample-subnet-public02"
  }
}

resource "aws_subnet" "private_subnet_az2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.80.0/20"
  availability_zone = "ap-northeast-1c"
  tags = {
    Name = "sample-subnet-private02"
  }
}

resource "aws_nat_gateway" "public_nat_az1" {
  allocation_id = aws_eip.nat_eip_az1.id
  subnet_id     = aws_subnet.public_subnet_az1.id
  depends_on    = [aws_internet_gateway.main, aws_eip.nat_eip_az1]
  tags = {
    Name = "sample-ngw-01"
  }
}

resource "aws_route53_zone" "private_zone" {
  name = "app.com"
  vpc {
    vpc_id = aws_vpc.main.id
  }
}

resource "aws_route53_record" "web_server_az1" {
  zone_id = aws_route53_zone.private_zone.zone_id
  name    = "web-server-az1.app.com"
  type    = "A"
  ttl     = "300"
  records = [aws_instance.web_server_az1.private_ip]
}

resource "aws_route53_record" "web_server_az2" {
  zone_id = aws_route53_zone.private_zone.zone_id
  name    = "web-server-az2.app.com"
  type    = "A"
  ttl     = "300"
  records = [aws_instance.web_server_az2.private_ip]
}

resource "aws_route53_record" "bastion" {
  zone_id = aws_route53_zone.private_zone.zone_id
  name    = "bastion.app.com"
  type    = "A"
  ttl     = "300"
  records = [aws_instance.bastion.private_ip]
}

resource "aws_eip" "nat_eip_az1" {
  vpc = true
  tags = {
    Name = "sample-ngw-01-eip"
  }
}

resource "aws_nat_gateway" "public_nat_az2" {
  allocation_id = aws_eip.nat_eip_az2.id
  subnet_id     = aws_subnet.public_subnet_az2.id
  depends_on    = [aws_internet_gateway.main, aws_eip.nat_eip_az2]
  tags = {
    Name = "sample-ngw-02"
  }
}

resource "aws_eip" "nat_eip_az2" {
  vpc = true
  tags = {
    Name = "sample-ngw-02-eip"
  }
}

resource "aws_route_table" "private_rt_az1" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.public_nat_az1.id
  }
  tags = {
    Name = "private-rt-az1"
  }
}

resource "aws_route_table" "private_rt_az2" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.public_nat_az2.id
  }
  tags = {
    Name = "private-rt-az2"
  }
}

resource "aws_route_table_association" "private_rt_assoc_az1" {
  subnet_id      = aws_subnet.private_subnet_az1.id
  route_table_id = aws_route_table.private_rt_az1.id
}

resource "aws_route_table_association" "private_rt_assoc_az2" {
  subnet_id      = aws_subnet.private_subnet_az2.id
  route_table_id = aws_route_table.private_rt_az2.id
}

resource "aws_key_pair" "my_key" {
  key_name   = "my-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "aws_security_group" "bastion_sg" {
  name        = "bastion-sg"
  description = "Security group for bastion host"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bastion-sg"
  }
}

resource "aws_security_group" "web_server_sg" {
  name        = "web-server-sg"
  description = "Security group for web servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "web-server-sg"
  }
}

resource "aws_instance" "bastion" {
  ami                    = "ami-02a405b3302affc24"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public_subnet_az1.id
  key_name               = aws_key_pair.my_key.key_name
  associate_public_ip_address = true
  private_ip             = "10.0.0.10"
  vpc_security_group_ids = [aws_security_group.bastion_sg.id]
  depends_on             = [aws_internet_gateway.main]
  tags = {
    Name = "bastion-host"
  }
}

resource "aws_instance" "web_server_az1" {
  ami                    = "ami-02a405b3302affc24"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_subnet_az1.id
  key_name               = aws_key_pair.my_key.key_name
  private_ip             = "10.0.64.10"
  vpc_security_group_ids = [aws_security_group.web_server_sg.id]
  depends_on             = [aws_nat_gateway.public_nat_az1]
  tags = {
    Name = "web-server-az1"
  }
}

resource "aws_instance" "web_server_az2" {
  ami                    = "ami-02a405b3302affc24"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_subnet_az2.id
  key_name               = aws_key_pair.my_key.key_name
  private_ip             = "10.0.80.10"
  vpc_security_group_ids = [aws_security_group.web_server_sg.id]
  depends_on             = [aws_nat_gateway.public_nat_az2]
  tags = {
    Name = "web-server-az2"
  }
}

resource "aws_security_group" "lb_sg" {
  name        = "lb-sg"
  description = "Security group for load balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "lb-sg"
  }
}

resource "aws_lb" "web_lb" {
  name               = "web-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = [aws_subnet.public_subnet_az1.id, aws_subnet.public_subnet_az2.id]

  tags = {
    Name = "web-lb"
  }
}

resource "aws_lb_target_group" "web_tg" {
  name     = "web-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 5
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = "web-tg"
  }
}

resource "aws_lb_listener" "web_listener" {
  load_balancer_arn = aws_lb.web_lb.arn
  port              = 3000
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web_tg.arn
  }
}

resource "aws_lb_target_group_attachment" "web_server_az1" {
  target_group_arn = aws_lb_target_group.web_tg.arn
  target_id        = aws_instance.web_server_az1.id
  port             = 3000
}

resource "aws_lb_target_group_attachment" "web_server_az2" {
  target_group_arn = aws_lb_target_group.web_tg.arn
  target_id        = aws_instance.web_server_az2.id
  port             = 3000
}

resource "aws_db_subnet_group" "main" {
  name       = "main-subnet-group"
  subnet_ids = [aws_subnet.private_subnet_az1.id, aws_subnet.private_subnet_az2.id]

  tags = {
    Name = "main-subnet-group"
  }
}

resource "aws_security_group" "db_sg" {
  name        = "db-sg"
  description = "Security group for RDS instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    security_groups = [aws_security_group.web_server_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "db-sg"
  }
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "mydb_password"
}

resource "aws_db_instance" "main" {
  allocated_storage    = 20
  engine               = "mariadb"
  engine_version       = "10.5"
  instance_class       = "db.t3.micro"
  username             = "admin"
  password             = data.aws_secretsmanager_secret_version.db_password.secret_string
  db_name              = "mydb"
  parameter_group_name = "default.mariadb10.5"
  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  skip_final_snapshot  = true

  tags = {
    Name = "main-db"
  }
}

output "rds_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "bastion_public_ip" {
  value = aws_instance.bastion.public_ip
}

output "load_balancer_dns_name" {
  value = aws_lb.web_lb.dns_name
}

output "db_password" {
  value = data.aws_secretsmanager_secret_version.db_password.secret_string
  sensitive = true
}
