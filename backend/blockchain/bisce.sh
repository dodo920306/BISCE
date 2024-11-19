#!/bin/bash

checkPrereqs()
{
    peer version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Error: peer binary not found." >&2
        exit 1
    fi

    fabric-ca-client version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Error: fabric-ca-client binary not found." >&2
        exit 2
    fi

    docker version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Error: docker binary not found." >&2
        exit 3
    fi

    docker compose version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Error: docker compose binary not found." >&2
        exit 4
    fi

    envsubst --version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Error: envsubst binary not found." >&2
        exit 5
    fi

    osnadmin --help > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Error: osnadmin binary not found." >&2
        exit 6
    fi

    configtxgen --version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Error: configtxgen binary not found." >&2
        exit 7
    fi

    configtxlator version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Error: configtxlator binary not found." >&2
        exit 8
    fi

    jq --version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Error: jq binary not found." >&2
        exit 9
    fi

    go version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Error: go binary not found." >&2
        exit 10
    fi
}

exportEnvVar()
{
    set -a
    . .env/.env
    PWD=`pwd`
    FABRIC_CFG_PATH="${PWD}/config"
    FABRIC_CA_CLIENT_HOME="${PWD}/blockchain"
    CORE_PEER_TLS_ENABLED=true
    CORE_PEER_LOCALMSPID="${ORG}MSP"
    CORE_PEER_TLS_ROOTCERT_FILE="${PWD}/peers/peer0/tls/ca.crt"
    CORE_PEER_MSPCONFIGPATH="${PWD}/users/bisce/msp"
    CORE_PEER_ADDRESS="${HOST}:7051"
    set +a
}

init()
{
    echo -e "\033[0;32m                      .coo;
                   .;looooooc,.
               .,coooooooooooooo:'
            .:oooooooooooooooooooool;.
        .,looooooooooooooooooooooooooooc'.
    .':oooooooooooooooooooooooooooooooooool;.
 .;looooooooooooooooooooooooooooooooooooooooooc,.
;ooooooooooooooooool;;looooc;:ooooooooooooooooooo.
loooooooooooooooool    ;;;    'oooooooooooooooooo;
oooooooooooooo:::,.            .;::cooooooooooooo;            ........            ...            ..'''..             ..'''..          ..........
ooooooooooooo.     .;:'''''';.     ,ooooooooooooo;            lo:''',lo:          'oc          ;oc,..,:o          'co:,''';lo        .oo,''''','
ooooooooooooo,   'l.  .       ,c.   loooooooooooo:            co.     lo'         'oc         ;o;                :o;                 .ol
ooooooooooool.  ,l   ;ol,.     .o.  ,oooooooooooo:            co.    .oo.         .o:         ,oc.              'oc                  .ol
ooooooooool.    o.   'ooolo:    ::    'oooooooooo:            co:,,,:o:.          .o:          .col;'.          co,                  .ol,,,,,,. 
ooooooooool.    o.    cool'..   ::    'oooooooooo:            co,....,cl,         .o:             .,col'        co,                  .ol......
ooooooooooool.  'l     .'',c   .o.  ;oooooooooooo:            co.      co,        .o:                 co;       ,ol                  .oc
ooooooooooooo,   'l'       .. ;c.   coooooooooooo:            co.      lo'        .o:         .       ;o,        co:        .        .oc
ooooooooooooo.     '::,,,,,,:;.     ,oooooooooooo;            lo:'',,:oc'         'o:         ol;''',ll'          'lo:,'',;ll        .ol,,,,,,,,
ooooooooooooooc::;.            .;::cooooooooooooo;            ........             ..          ...'...               ..''..           ..........
loooooooooooooooooo    ...    'oooooooooooooooooo;
;ooooooooooooooooooo::looooc;cooooooooooooooooooo.
 .,looooooooooooooooooooooooooooooooooooooooooc'
     ':oooooooooooooooooooooooooooooooooool;.
        .,coooooooooooooooooooooooooooo:'.
            .;looooooooooooooooooool,.
               .':oooooooooooool;.
                   .,coooooo:'.
                      .coo;\033[0m"
    if [[ -n "${ORG}" ]]; then
        echo -e "The name of your organization is \e[1;31m${ORG}\e[0m."
        while true; do
            read -p "Can you confirm that this is correct? (Y/n) " confirm
            if [[ "$confirm" == "Y" || "$confirm" == "n" ]]; then
                break
            else
                echo "Invalid input. Please enter 'Y' or 'n'." >&2
            fi
        done
    else
        echo "Error: environment variable 'ORG' doesn't have a value." >&2
        exit -1
    fi
    
    if [[ "$confirm" == "Y" ]]; then
        if [[ ! $ORG =~ ^[a-zA-Z0-9]+$ ]]; then
            echo "Error: The value of 'ORG' shouldn't include characters that are not letters and numbers." >&2
            exit -2
        fi
    elif [[ "$confirm" == "n" ]]; then
        echo "Initialization Cancelled by the user."
        exit 0
    else
        echo "Error: Unknown Error" >&2
        exit -3
    fi

    if [[ -n "${HOST}" ]]; then
        echo -e "The hostname of your BISCE is \e[1;31m${HOST}\e[0m."
        while true; do
            read -p "Can you confirm that this is correct? (Y/n) " confirm
            if [[ "$confirm" == "Y" || "$confirm" == "n" ]]; then
                break
            else
                echo "Invalid input. Please enter 'Y' or 'n'." >&2
            fi
        done
    else
        echo "Error: environment variable 'HOST' doesn't have a value." >&2
        exit -1
    fi
    
    if [[ "$confirm" == "Y" ]]; then
        if [[ ! $ORG =~ ^[a-zA-Z0-9.]+$ ]]; then
            echo "Error: The value of 'HOST' shouldn't include characters that are not letters, dots, and numbers." >&2
            exit -2
        else
            echo "Welcome ${ORG}!"
        fi
    elif [[ "$confirm" == "n" ]]; then
        echo "Initialization Cancelled by the user."
        exit 0
    else
        echo "Error: Unknown Error" >&2
        exit -3
    fi

    echo "Initiation starts."

    docker volume create orderer0
    docker volume create peer0

    mkdir fabric-ca 2>/dev/null

    envsubst '${ORG} ${HOST} ${PWD}' \
        < template/configtx.template.yaml \
        > config/configtx.yaml
    envsubst '${ORG} ${HOST}' \
        < template/fabric-ca-server-config.template.yaml \
        > fabric-ca/fabric-ca-server-config.yaml
    envsubst '${ORG}' \
        < template/fabric-ca-client-config.template.yaml \
        > fabric-ca-client-config.yaml

    echo "Initiation completed."
}

setup()
{
    echo "Setup starts."

    docker compose -f docker-compose/docker-compose-ca.yaml up -d
    sleep 5
    HTTP_STATUS=$(curl -X GET -s -o /dev/null -w "%{http_code}" http://localhost:17054/healthz)
    if [ "$HTTP_STATUS" -ne 200 ]; then
        echo "Fabric CA Server is not healthy (HTTP $HTTP_STATUS). Retrying in 5 seconds..."
        sleep 5
        HTTP_STATUS=$(curl -X GET -s -o /dev/null -w "%{http_code}" http://localhost:17054/healthz)
        if [ "$HTTP_STATUS" -ne 200 ]; then
            echo "Fabric CA Server is unhealthy, exiting."
            exit -6
        fi
    fi

    echo "Fabric CA Server is healthy."
    echo "create Fabric CA Client user"
    if ! fabric-ca-client identity list --id caadmin --tls.certfiles fabric-ca/ca-cert.pem 1>/dev/null 2>/dev/null; then
        fabric-ca-client enroll \
            -u https://caadmin:caadminpw@localhost:7054 \
            --caname "ca-${ORG}" --tls.certfiles fabric-ca/ca-cert.pem
        echo "NodeOUs:
    Enable: true
    ClientOUIdentifier:
        Certificate: cacerts/localhost-7054-ca-${ORG}.pem
        OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
        Certificate: cacerts/localhost-7054-ca-${ORG}.pem
        OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
        Certificate: cacerts/localhost-7054-ca-${ORG}.pem
        OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
        Certificate: cacerts/localhost-7054-ca-${ORG}.pem
        OrganizationalUnitIdentifier: orderer" > msp/config.yaml

        mkdir msp/tlscacerts tlsca ca 2>/dev/null

        cp fabric-ca/ca-cert.pem msp/tlscacerts/ca.crt
        cp fabric-ca/ca-cert.pem tlsca/tlsca-cert.pem
        cp fabric-ca/ca-cert.pem ca/ca-cert.pem
    else
        echo "Fabric CA Client user exists. Skipping."
    fi

    echo "create Order0 user"
    if ! fabric-ca-client identity list --id orderer0 --tls.certfiles fabric-ca/ca-cert.pem 1>/dev/null 2>/dev/null; then
        fabric-ca-client register \
            --caname "ca-${ORG}" \
            --id.name orderer0 \
            --id.secret orderer0pw \
            --id.type orderer \
            --tls.certfiles fabric-ca/ca-cert.pem 1>/dev/null 2>/dev/null
        fabric-ca-client enroll \
            -u https://orderer0:orderer0pw@localhost:7054 \
            --caname "ca-${ORG}" \
            -M orderers/orderer0/msp \
            --tls.certfiles fabric-ca/ca-cert.pem

        cp msp/config.yaml orderers/orderer0/msp/config.yaml

        fabric-ca-client enroll \
            -u https://orderer0:orderer0pw@localhost:7054 \
            --caname "ca-${ORG}" \
            -M orderers/orderer0/tls \
            --enrollment.profile tls \
            --csr.hosts localhost \
            --csr.hosts "${HOST}" \
            --tls.certfiles fabric-ca/ca-cert.pem

        cp "orderers/orderer0/tls/tlscacerts/tls-localhost-7054-ca-${ORG}.pem" orderers/orderer0/tls/ca.crt
        cp orderers/orderer0/tls/signcerts/cert.pem orderers/orderer0/tls/server.crt
        cp orderers/orderer0/tls/keystore/* orderers/orderer0/tls/server.key

        mkdir orderers/orderer0/msp/tlscacerts 2>/dev/null
        cp "orderers/orderer0/tls/tlscacerts/tls-localhost-7054-ca-${ORG}.pem" orderers/orderer0/msp/tlscacerts/tlsca-cert.pem
    else
        echo "Order0 user exists. Skipping."
    fi

    echo "create Peer0 user"
    if ! fabric-ca-client identity list --id peer0 --tls.certfiles fabric-ca/ca-cert.pem 1>/dev/null 2>/dev/null; then
        fabric-ca-client register \
            --caname "ca-${ORG}" \
            --id.name peer0 \
            --id.secret peer0pw \
            --id.type peer \
            --tls.certfiles fabric-ca/ca-cert.pem 1>/dev/null
        fabric-ca-client enroll \
            -u https://peer0:peer0pw@localhost:7054 \
            --caname "ca-${ORG}" \
            -M peers/peer0/msp \
            --tls.certfiles fabric-ca/ca-cert.pem

        cp msp/config.yaml peers/peer0/msp/config.yaml

        fabric-ca-client enroll \
            -u https://peer0:peer0pw@localhost:7054 \
            --caname "ca-${ORG}" \
            -M peers/peer0/tls \
            --enrollment.profile tls \
            --csr.hosts localhost \
            --csr.hosts "${HOST}" \
            --tls.certfiles fabric-ca/ca-cert.pem

        cp "peers/peer0/tls/tlscacerts/tls-localhost-7054-ca-${ORG}.pem" peers/peer0/tls/ca.crt
        cp peers/peer0/tls/signcerts/cert.pem peers/peer0/tls/server.crt
        cp peers/peer0/tls/keystore/* peers/peer0/tls/server.key
    else
        echo "Peer0 user exists. Skipping."
    fi

    echo "create Bisce user"
    if ! fabric-ca-client identity list --id bisce --tls.certfiles fabric-ca/ca-cert.pem 1>/dev/null 2>/dev/null; then
        fabric-ca-client register \
            --caname "ca-${ORG}" \
            --id.name bisce \
            --id.secret biscepw \
            --id.type admin \
            --tls.certfiles fabric-ca/ca-cert.pem 1>/dev/null
        fabric-ca-client enroll \
            -u https://bisce:biscepw@localhost:7054 \
            --caname "ca-${ORG}" \
            -M users/bisce/msp \
            --tls.certfiles fabric-ca/ca-cert.pem

        cp msp/config.yaml users/bisce/msp/config.yaml
    else
        echo "Bisce user exists. Skipping."
    fi

    docker compose -f docker-compose/docker-compose.yaml up -d

    
    envsubst '${ORG}' \
        < template/bisce-network-ca.template.json \
        > bisce-network-ca.json

    peer lifecycle chaincode package bisce.tar.gz \
        --path $PWD/chaincode \
        --lang golang \
        --label bisce_1.0
    nc -z localhost 7051
    echo $?
    sleep 5
    nc -z localhost 7051
    echo $?
    peer lifecycle chaincode install bisce.tar.gz

    echo "Setup completed."
}

reset()
{
    echo "Reset starts."
    docker compose -f docker-compose/docker-compose-explorer.yaml \
                   -f docker-compose/docker-compose-ca.yaml \
                   -f docker-compose/docker-compose.yaml down
    echo "Reset completed."
}

uninit()
{
    echo "Uninit starts"
    sudo umount channels/*
    sudo rm -rf \
        fabric-ca/ \
        peercfg/ \
        msp/ \
        ca/ \
        tlsca/ \
        users/ \
        orderers/ \
        peers/ \
        fabric/ \
        channels/
    docker compose -f docker-compose/docker-compose-explorer.yaml \
                   -f docker-compose/docker-compose-ca.yaml \
                   -f docker-compose/docker-compose.yaml down -v
    docker volume rm peer0 orderer0
    sudo rm -f \
        config/configtx.yaml \
        fabric-ca-client-config.yaml \
        bisce-network-ca.json \
        bisce.tar.gz \
        fetchBlock/*.json
    echo "Uninit completed"
}

createChannel()
{
    echo "Creation of the channel starts."
    configtxgen -profile Bisce -outputBlock config_block.pb -channelID "${CHANNEL}"
    osnadmin channel join \
        --channelID "${CHANNEL}" \
        --config-block config_block.pb \
        -o "${HOST}:7053" \
        --ca-file tlsca/tlsca-cert.pem \
        --client-cert orderers/orderer0/tls/server.crt \
        --client-key orderers/orderer0/tls/server.key
    peer channel join \
        -b config_block.pb
    rm config_block.pb

    envsubst '${ORG} ${HOST} ${CHANNEL}' \
        < template/config_update_in_envelope.template.json \
        > config_update_in_envelope.json
    configtxlator proto_encode \
        --input config_update_in_envelope.json \
        --type common.Envelope \
        --output config_update_in_envelope.pb
    rm config_update_in_envelope.json
    # wait for peer leader election
    sleep 5
    peer channel update \
        -f config_update_in_envelope.pb \
        -c "${CHANNEL}" \
        -o "${HOST}:7050" \
        --tls \
        --cafile "${PWD}/peers/peer0/tls/ca.crt"
    if [ $? -ne 0 ]; then
        echo "Update config failed, retrying in 5 seconds..."
        sleep 5
        peer channel update \
            -f config_update_in_envelope.pb \
            -c "${CHANNEL}" \
            -o "${HOST}:7050" \
            --tls \
            --cafile "${PWD}/peers/peer0/tls/ca.crt"
        if [ $? -ne 0 ]; then
            echo "Update config failed again, exiting."
            exit -5
        fi
    fi
    rm config_update_in_envelope.pb
    mkdir -p channels/${CHANNEL}/orgRequests channels/${CHANNEL}/proposals
    peer channel fetch 0 \
        "channels/${CHANNEL}/${CHANNEL}.block" \
        -o "${HOST}:7050" \
        -c "${CHANNEL}" \
        -o "${HOST}:7050" \
        --tls \
        --cafile "${PWD}/peers/peer0/tls/ca.crt"

    export CC_PACKAGE_ID=`peer lifecycle chaincode queryinstalled --output json | jq '.installed_chaincodes[0].package_id'`
    peer lifecycle chaincode approveformyorg \
        -o localhost:7050 \
        --channelID "${CHANNEL}" \
        --name bisce \
        --version 1.0 \
        --package-id "${CC_PACKAGE_ID//\"/}" \
        --sequence 1 \
        --tls \
        --cafile "${PWD}/peers/peer0/tls/ca.crt"
    peer lifecycle chaincode commit \
        -o localhost:7050 \
        --channelID "${CHANNEL}" \
        --name bisce \
        --version 1.0 \
        --sequence 1 \
        --tls \
        --cafile "${PWD}/peers/peer0/tls/ca.crt" \
        --peerAddresses localhost:7051 \
        --tlsRootCertFiles "${PWD}/peers/peer0/tls/ca.crt"
    peer chaincode invoke \
        -o localhost:7050 \
        --tls \
        --cafile "${PWD}/peers/peer0/tls/ca.crt" \
        --peerAddresses localhost:7051 \
        --tlsRootCertFiles "${PWD}/peers/peer0/tls/ca.crt" \
        -C "${CHANNEL}" \
        -n bisce \
        -c '{"function":"Initialize","Args":["Carbon Token", "CT", "2"]}'

    jq ".channels += { \
		\"${CHANNEL}\": { \
			\"peers\": { \
				\"peer0\": {} \
			}, \
			\"connection\": { \
				\"timeout\": { \
					\"peer\": { \
						\"endorser\": \"6000\", \
						\"eventHub\": \"6000\", \
						\"eventReg\": \"6000\" \
					} \
				} \
			} \
		} \
    }" bisce-network-ca.json \
    > tmp.json
    mv tmp.json bisce-network-ca.json

    docker compose -f docker-compose/docker-compose-explorer.yaml up -d
    echo "Creation of the channel completed."
}

generateRequest()
{
    echo "Request for joining the channel ${CHANNEL} generation starts."
    mkdir channels/${CHANNEL}/orgRequests/${ORG}
    touch channels/${CHANNEL}/orgRequests/${ORG}/.env
    echo -e "HOST=${HOST}\nCERT=$(base64 orderers/orderer0/tls/server.crt | tr -d '\n')" \
        > channels/${CHANNEL}/orgRequests/${ORG}/.env
    configtxgen -printOrg ${ORG} > ${ORG}.json
    mv ${ORG}.json channels/${CHANNEL}/orgRequests/${ORG}/${ORG}.json
    echo "Request for joining the channel ${CHANNEL} generation completed."
}

joinChannel()
{
    echo "Channel ${CHANNEL} joining starts."
    osnadmin channel join \
        --channelID ${CHANNEL} \
        --config-block "channels/${CHANNEL}/${CHANNEL}.block" \
        -o "${HOST}:7053" \
        --ca-file tlsca/tlsca-cert.pem \
        --client-cert orderers/orderer0/tls/server.crt \
        --client-key orderers/orderer0/tls/server.key
    peer channel join -b "channels/${CHANNEL}/${CHANNEL}.block"

    jq ".channels += { \
		\"${CHANNEL}\": { \
			\"peers\": { \
				\"peer0\": {} \
			}, \
			\"connection\": { \
				\"timeout\": { \
					\"peer\": { \
						\"endorser\": \"6000\", \
						\"eventHub\": \"6000\", \
						\"eventReg\": \"6000\" \
					} \
				} \
			} \
		} \
    }" bisce-network-ca.json \
    > tmp.json
    mv tmp.json bisce-network-ca.json

    docker compose -f docker-compose/docker-compose-explorer.yaml up -d

    export CC_PACKAGE_ID=`peer lifecycle chaincode queryinstalled --output json | jq '.installed_chaincodes[0].package_id'`
    peer lifecycle chaincode approveformyorg \
        -o localhost:7050 \
        --channelID "${CHANNEL}" \
        --name bisce \
        --version 1.0 \
        --package-id "${CC_PACKAGE_ID//\"/}" \
        --sequence 1 \
        --tls \
        --cafile "${PWD}/peers/peer0/tls/ca.crt"
    echo "Channel ${CHANNEL} joining completed."
}

listChannel()
{
    osnadmin channel list \
        -o "${HOST}:7053" \
        --ca-file tlsca/tlsca-cert.pem \
        --client-cert orderers/orderer0/tls/server.crt \
        --client-key orderers/orderer0/tls/server.key
    osnadmin channel list \
        --channelID ${CHANNEL} \
        -o "${HOST}:7053" \
        --ca-file tlsca/tlsca-cert.pem \
        --client-cert orderers/orderer0/tls/server.crt \
        --client-key orderers/orderer0/tls/server.key
    peer channel list
}

generateProposal()
{
    echo "Proposal generation for $1 starts."
    peer channel fetch config config_block.pb \
        -o localhost:7050 \
        -c ${CHANNEL} \
        --tls \
        --cafile "${PWD}/orderers/orderer0/tls/ca.crt"
    set -a
    . channels/${CHANNEL}/orgRequests/$1/.env
    set +a
    configtxlator proto_decode \
        --input config_block.pb \
        --type common.Block \
        --output config_block.json
    rm config_block.pb
    jq ".data.data[0].payload.data.config" config_block.json \
        > config.json
    rm config_block.json
    jq -s \
        ".[0] * {
            \"channel_group\": {
                \"groups\": {
                    \"Application\": {
                        \"groups\": {
                            \"$1\": .[1]
                        }
                    }
                }
            }
        } |
        del(.channel_group.groups.Application.groups.$1.values.Endpoints) |
        .channel_group.groups.Application.groups.$1.values += {
            \"AnchorPeers\": {
                \"mod_policy\": \"Admins\",
                \"value\": {
                    \"anchor_peers\": [{
                        \"host\": \"${HOST}\",
                        \"port\": 7051
                    }]
                },
                \"version\": \"0\"
            }
        }" \
        config.json "channels/${CHANNEL}/orgRequests/$1/$1.json" \
        | jq -s \
        ".[0] * {
            \"channel_group\": {
                \"groups\": {
                    \"Orderer\": {
                        \"groups\": {
                            \"$1\": .[1]
                        }
                    }
                }
            }
        } |
        .channel_group.groups.Orderer.values.ConsensusType.value.metadata.consenters += [{
            \"client_tls_cert\": \"${CERT}\",
            \"host\": \"${HOST}\",
            \"port\": 7050,
            \"server_tls_cert\": \"${CERT}\"
        }]" \
        - "channels/${CHANNEL}/orgRequests/$1/$1.json" \
        > modified_config.json
    configtxlator proto_encode \
        --input config.json \
        --type common.Config \
        --output config.pb
    rm config.json
    configtxlator proto_encode \
        --input modified_config.json \
        --type common.Config \
        --output modified_config.pb
    rm modified_config.json
    configtxlator compute_update \
        --channel_id ${CHANNEL} \
        --original config.pb \
        --updated modified_config.pb \
        --output update.pb
    rm config.pb modified_config.pb 
    configtxlator proto_decode \
        --input update.pb \
        --type common.ConfigUpdate \
        --output update.json
    rm update.pb
    echo '{"payload":{"header":{"channel_header":{"channel_id":"'${CHANNEL}'", "type":2}},"data":{"config_update":'$(cat update.json)'}}}' \
        | jq . > update_in_envelope.json
    rm update.json
    configtxlator proto_encode \
        --input update_in_envelope.json \
        --type common.Envelope \
        --output channels/${CHANNEL}/proposals/$1.pb
    rm -rf update_in_envelope.json channels/${CHANNEL}/orgRequests/$1
    echo "Proposal generation for $1 completed."
}

signProposal()
{
    echo "Proposal signing for $1 starts."
    peer channel signconfigtx \
        -f "channels/${CHANNEL}/proposals/$1.pb"
    echo "Proposal signing for $1 completed."
}

commitProposal()
{
    echo "Proposal commitment for $1 starts."
    peer channel update \
        -f "channels/${CHANNEL}/proposals/$1.pb" \
        -c "${CHANNEL}" \
        -o "${HOST}:7050" \
        --tls \
        --cafile "${PWD}/peers/peer0/tls/ca.crt"
    echo "Proposal commitment for $1 completed."
}

logs()
{
    docker compose -f docker-compose/docker-compose.yaml \
                   -f docker-compose/docker-compose-ca.yaml \
                   -f docker-compose/docker-compose-explorer.yaml logs $@ -f
}

signup()
{
    fabric-ca-client register \
        --caname "ca-${ORG}" \
        --id.name $1 \
        --id.secret $2 \
        --id.type client \
        --tls.certfiles fabric-ca/ca-cert.pem 1>/dev/null
    fabric-ca-client enroll \
        -u https://$1:$2@localhost:7054 \
        --caname "ca-${ORG}" \
        -M users/$1/msp \
        --tls.certfiles fabric-ca/ca-cert.pem
    cp msp/config.yaml users/$1/msp/config.yaml
    export CORE_PEER_MSPCONFIGPATH="${PWD}/users/$1/msp"
    application/token_erc_20 register
}

callApp()
{
    application/token_erc_20 $@
}

if [[ $# -lt 1 ]] ; then
    echo "Error: no action is given" >&2
    exit -4
else
    MODE=$1
    shift
fi

checkPrereqs
exportEnvVar

case "$MODE" in
    init )
        init
        ;;
    setup )
        setup
        ;;
    reset )
        reset
        ;;
    uninit )
        uninit
        ;;
    createChannel )
        createChannel
        ;;
    generateRequest )
        generateRequest
        ;;
    joinChannel )
        joinChannel
        ;;
    listChannel )
        listChannel
        ;;
    generateProposal )
        generateProposal $@
        ;;
    signProposal )
        signProposal $@
        ;;
    commitProposal )
        commitProposal $@
        ;;
    logs )
        logs $@
        ;;
    signup )
        signup $@
        ;;
    callApp )
        callApp $@
        ;;
    * )
        echo "Error: no such action" >&2
        exit -5
esac