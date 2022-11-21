# Changelog

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
