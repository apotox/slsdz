export const templateFnBody = `---
Parameters:
  functionName:
    Type: "String"
  basicRoleArn:
    Type: "String"
  functionsBucket:
    Type: "String"
  fileName:
    Type: "String"
  apigatewayId:
    Type: "String"
  apigatewayStage:
    Type: "String"
  certificateArn:
    Type: "String"
  domainName:
    Type: "String"
Resources:
  LambdaFunction:
    Type: 'AWS::Lambda::Function'
    Properties:
      FunctionName: !Ref functionName
      Runtime: nodejs16.x
      Role: !Ref basicRoleArn
      Handler: index.handler
      Code:
        S3Bucket: !Ref functionsBucket
        S3Key: !Ref fileName
      Description: user lambda
      Timeout: 3
      MemorySize: 128
      ReservedConcurrentExecutions: 1
  MyCustomDomain:
    Type: 'AWS::ApiGatewayV2::DomainName'
    Properties:
      DomainName: !Ref domainName
      DomainNameConfigurations:
        - CertificateArn: !Ref certificateArn
          SecurityPolicy: tls_1_2
  MyApiMapping:
    Type: 'AWS::ApiGatewayV2::ApiMapping'
    Properties:
      ApiId: !Ref apigatewayId
      DomainName: !Ref MyCustomDomain
      Stage: !Ref apigatewayStage
    DependsOn:
      - MyCustomDomain
`;
