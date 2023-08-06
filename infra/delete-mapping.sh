#!/bin/bash

region="us-east-1"
api_id=""
# List of custom domain names to delete
custom_domains=("abc.safidev.de")

for domain_name in "${custom_domains[@]}"; do
    # Check if the custom domain exists
    if aws apigatewayv2 get-domain-name --domain-name "$domain_name" --region "$region" &>/dev/null; then
        echo "Deleting base path mappings for custom domain: $domain_name"

        # Get the base path mappings for the custom domain
        mappings=$(aws apigatewayv2 get-base-path-mappings --domain-name "$domain_name" --region "$region" --query "Items[].[BasePath]" --output text)

        # Loop through the base path mappings and delete them
        for mapping in $mappings; do
            aws apigatewayv2 delete-base-path-mapping --api-id "$api_id" --stage "$mapping" --domain-name "$domain_name" --region "$region"
        done

        # Delete the custom domain
        aws apigatewayv2 delete-domain-name --domain-name "$domain_name" --region "$region"

        echo "Custom domain $domain_name deleted."
    else
        echo "Custom domain $domain_name not found. Skipping..."
    fi

    echo 'sleeping...'

    sleep 30
done
