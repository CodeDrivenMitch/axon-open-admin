# Changelog


## 0.3.2

- Update commons-io to fix vulnerability, thanks to @oysteing (#65)
- Implement better concurrency support, thanks to @stoerti (#63)

## 0.3.1

- Fix broken command status checking on clustered backends, thanks to @oysteing

## 0.3.0

- Spring Boot 3 compatibility
- Add message about AxonIQ Console, as this is where new developments will be

## 0.2.8

- Fix NPE when event store is empty (#47)
- Fix Spring bootstrap error (possibly) by removing default null parameter (#47)
- Fix InsightHandlerEnhancer preventing replay due to no started UoW. Fixes #49
- Fix NPE if resource is missing in unit of work. Fixes #46

## 0.2.7

- Fix issue with DLQ url not always redirecting to the right location

## 0.2.6

- Fix TokenProvider returning wrong token for JDBC and JPA
- Improve NodeIdProvider to only calculate its value lazily

## 0.2.5

- Fix exception when setting base url (thanks @oysteing!)
- Fix ClassNotFoundException in EventTailingService when excluding the axon server module

## 0.2.4

- Fix bug in DLQ when the `SequencingPolicy` returns a null value.
  Will not default to the message identifier.

## 0.2.3

- Fix bug in DLQ page. It was not aware of the multiservice feature introduced in 0.2.0.
- Add information to DLQ page header to indicate when it was last refreshed. Added a back button as well.

## 0.2.2
Missing release due to personal error

## 0.2.1
- Fix error in context path

## 0.2.0
- Introduce the DLQ page
- Refactor all event processor code to use the `EventProcessorStatus` api. 
- Show event processor metrics on event processor overview
- Add option to query aggregate events in event search
- Allow user to configure multiple services for the same Axon Open Admin application
